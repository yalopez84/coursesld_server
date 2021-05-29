## coursesld_server 📘
![imagen](https://user-images.githubusercontent.com/57901401/120082992-f8b0e480-c093-11eb-98fb-eca40684355a.png)


#### Dependencies
  -[rawdata_api](https://github.com/yalopez84/rawdata_api "rawdata_api")
   
#### Tecnologies 
    -nodejs, express, morgan, babel
    
#### Configuration files

	-config_files/server_config.js 
		module.exports = {
		    protocol: 'http',
		    hostname: 'localhost:4000',
		    port: 4000,
		}
    
 	-skeleton.jsonld (Hydra vocabulary template)
 	-skeleton_tree.jsonld (Tree vocabulary template)
 
#### Input files 
	-files/raw_data/{entityname}.json. Raw data of entities to be transformed in JSON format. In this case files/raw_data/courses.json.
	-files/ld/ontologies/courseontology.ttl. Course ontology needed to transform course raw data to linked courses.

#### Output files
	-files/ld/entityname/entityname.jsonld, files/ld/entityname/entityname.ttl, files/ld/entityname/entityname.n3, files/ld/entityname/entityname.csv. Four formats are obtained (json ld, turtle, n triples y csv). In this case, course datset is the only transformed and four files of that dataset are obtained.
	-fragments/both/*, fragments/startDates/* directories. When a client requests the course dataset in JSON LD format, the customized interface splits the dataset into fragments and saves them in the previous directories.
	
#### Objective
    -Publishing university entities as linked data. In this proof of concept, we only have linked courses. 
    
#### Explanation
	-This is a back-end component to publish university courses as linked data in order for being consumed by client apps 
	such as course recommenders. 
	
	-The entrypoint src/index.js file calls src/app.js where prefixes of each module of the API are set up.
	
	-When the client accesses the home (http://hostname/ld/), datasets catalog is shown (In this case we only have the course dataset).
	At the same time, the server transforms raw data to linked data. For each transformed entity, four files are got(one for each 
	serialization format JSON LD, ttl, n3 y csv) 
	
	-How to access the linked datasets? Datasets can be got from the catalog in the university home (http://hostname/ld/). 
	The university catalog contains the dataset accessURl via dataset distributions. 
	Datasets can be also got by clicking the URL http://hostname/ld/{entitynameinplural} for instance http://hostname/ld/courses.
	
	-Clients can request the serialization formats via content negotiation. 
	Possible "request=>response"(accept=>Content-Type) variants are: ”text/plain”=>"ttl", ”text/n3”=> "n3",
	”text/csv”=>"csv", ”"application/json”=>"jsonld". In order to text that, you can use Insomnia tool
	(https://insomnia.rest/download).
	
	-When the client requests the JSON LD format, a customized query attends it which is a proof of concept in order to show the benefits 
	that this kind of query can provide for courses recommender apps. The URL template of this customized query 
	is http://hostname/ld/courses?startDate={startDateQuery}&subject={subjectQuery},e.g http://localhost:4000/ld/courses?startdate=2011-11-11&subject=educational_informatics.
	The variable startDate allows the client to query the server asking for courses that start thereafter and the variable subject 
	allows to restrict the searching to courses with that subject. This component sorts the courses that meet the requirements in 
	ascending order by start date and deliver them fragment by fragment. Automatic client-server communication can be carried out thanks 
	to Tree or Hydra vocabularies.  
	
  	-Done fragmentation is leveraged by other clients that request the same query to the server. 
   	 The fragment lifetime depends on the server cache. 
    
   	-Fragments are stored into two possible directories: if the request URL template includes the variables: startDate and subject then a new folder 
    	is created in the "fragments/both/" directory whose name is the value of the startDate and in turn, in this new directory, another folder 
    	is created whose name is the value of the subject. Otherwise, a new folder is created in the "fragments/startDates/" directory whose name 
    	is the value of the startDate. By default, current date will be assumed when this variable does not show up.
	
	-In order to automatize the client-server communication, Client apps can find how to interact with this server via the Hydra API documentation
	http://{hostname}/ld/apiDocumentation that was implemented in this component.
#### Instalation steps
	1. Install tecnologies
		npm install @babel/polyfill 
		npm install express
		npm install morgan 
		npm install --save-dev @babel/core @babel/cli @babel/preset-env  
		npm install nodemon -D 
		npm install @babel/node -D 
		npm install n3
	2.Create .babelrc file to specify Babel to work with novel javascript code
		{
		    "presets": [
  		      "@babel/preset-env"
  		  ]
		} 
	3.Create the folder src and the file src/index.js
	4.Replace the following in the package.json file:
		    "test": "echo \"Error: no test specified\" && exit 1" 
        =>	
            "dev":"nodemon src/index.js --exec babel-node",  
			"build": "babel src --out-dir dist",  
			"start":"node dist/index.js"	
	5.To test the app:
		npm run dev
	6.To put into production
		npm run build 
		npm start 
