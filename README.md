efg-structure-graph
===================

Plots the member list of our baptist church as a graph of members and departments in a web page using [cytoscape.js](https://github.com/cytoscape/cytoscape.js). 

I highly doubt that anyone else will find this useful as we have a non-standard format for our list living in a gigantic excel spreadsheet. But maybe... feel just free to try.

usage
-----

```bash
git clone https://github.com/dominikschreiber/efg-structure-graph.git
cd efg-structure-graph
./create.js <your-list-export>.csv # prints to stdout
./create.js <your-list-export>.csv > out.html # saves this as out.html
```

expected csv file format
------------------------

```csv
;;;;Department1;Department2;DepartmentN;
LineNumber;Lastname;Firstname;Birthdate;x;L;P;
````

- *First Line:* department names in columns 5+
- *Other Lines:*
  - *Column 1:* line number, not used
  - *Column 2:* last name of member
  - *Column 3:* first name of member
  - *Column 4:* birthdate of member, not used
  - *Column 5:* membership status for the specific department
    - *:* no member
    - *x:* regular member
    - *L* or *1:* leading member
    - *P:* potential member
    