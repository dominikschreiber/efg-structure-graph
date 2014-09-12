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