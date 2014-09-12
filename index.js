#!/usr/local/bin/node

function createNode(nodeId) {
  return {
    data: {
      id: nodeId,
      name: names[nodeId]
    }
  }
}

function createEdge(ids) {
  var idcomponents = ids.split(' ')
    , result = {
        data: {
          source: idcomponents[0]
        }
      };
  
  if (_(ids).endsWith('!')) {
    result.data.target = idcomponents[1].slice(0,-1);
    result.classes = [result.classes, 'leading'].join(' ');
  } else if (_(ids).endsWith('?')) {
    result.data.target = idcomponents[1].slice(0,-1);
    result.classes = [result.classes, 'potential'].join(' ');
  } else {
    result.data.target = idcomponents[1];
  }
  
  return result;
}

function createAndSaveTaskId(taskname) {
  var id = '_' + _.slugify(taskname);
  
  names[id] = taskname;
  
  return id;
}

function createMemberId(member) {
  return (member[2] + member[1].slice(0, 1)).toLowerCase();
}

function isNormalTask(tasktype) {
  return tasktype === 'x';
}

function isLeadingTask(tasktype) {
  return ['l', '1'].indexOf(tasktype) > -1;
}

function isPotentialTask(tasktype) {
  return tasktype === 'p';
}

var csv = require('csv')
  , fs = require('fs')
  , es = require('event-stream')
  , util = require('util')
  , concat = require('concat-stream')
  , _ = require('underscore')
  , input = process.argv.slice(-1)[0]
  , graph = {}
  , names = {}

  , firstTaskColumn = 4;
  
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

fs.createReadStream(input)
  .pipe(csv.parse({delimiter: ';'}))
  .pipe(es.mapSync(function(record) { return [record]; }))
  .pipe(concat(function(graph) {
    var tasks = _.map(graph[0].slice(firstTaskColumn), createAndSaveTaskId)
      , members = graph.slice(1)
      , membersToTasks = {}
      , result = {};
  
    _.each(members, function(member) {
      var memberId = createMemberId(member.slice(0,firstTaskColumn));
      
      names[memberId] = member[2] + ' ' + member[1];
      membersToTasks[memberId] = [];
      
      _.each(member.slice(firstTaskColumn), function(task, i) {
        var tasktype;
        
        if (task !== '') {
          tasktype = task.toLowerCase();
          if (isNormalTask(tasktype)) { membersToTasks[memberId].push(tasks[i]); }
          if (isLeadingTask(tasktype)) { membersToTasks[memberId].push(tasks[i] + '!'); }
          if (isPotentialTask(tasktype)) { membersToTasks[memberId].push(tasks[i] + '?'); }
        }
      });
    });
  
    result.nodes = _.map(tasks.concat(Object.keys(membersToTasks)), createNode);
    result.edges = _.chain(_.pairs(membersToTasks))
      .map(function(memberToTasks) {
        return _.map(memberToTasks[1], function(task) {
          return memberToTasks[0] + ' ' + task;
        });
      })
      .flatten()
      .map(createEdge)
      .value();
    
    fs.createReadStream('./template.html')
      .pipe(es.replace('<%= result %>', JSON.stringify(result)))
      .pipe(process.stdout);
  }));