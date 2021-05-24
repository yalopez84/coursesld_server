## coursesld_server
#### Dependencies
    -rawdata_api component
#### Tecnologies
    -nodejs, express, morgan, babel
#### Configuration files
	-config_files/server_config.js 
		module.exports = {
		    protocol: 'http',
		    hostname: 'localhost:3000',
		    port: 3000,
		}
	-skeleton.jsonld. Hydra vocabulary template.
	-skeleton_tree.jsonld. Tree vocabulary template.
#### Inputs files 
	-files/raw_data/*.json. Raw data of entities to be transformed in JSON format. In this case files/raw_data/courses.json.
	-files/ld/ontologies/courseontology.ttl. Course ontology needed to transfor course raw data to linked courses.
	-fragments/both/ and fragments/startDates. Directories needed to save fragments of course customized query.
	-files/ld/. Directory needed to save linked entities.
#### Outputs files
	-files/ld/entityname/entityname.jsonld, files/ld/entityname/entityname.ttl, files/ld/entityname/entityname.n3, files/ld/entityname/entityname.csv. For each entity its transformation on four formats is obtained (json ld, turtle, n triples y csv). In this case, course datset is the only datset obtained.
	-fragments/both/*, fragments/startDates/* directories. When a client requests the dataset course on JSON LD format, the customized interface splits the dataset into fragments and saves them in previos directories.
#### Objectives
    -Publishing university entities as linked data. In this proof of concept, we only have linked courses. 
#### Explanation
	-A back end component to publish university courses as linked data in order for being consumed by client apps like course recommender apps.
	-The entrypoint src/index.js file calls src/app.js where prefixes of each module of the API are set up.
    -Where the client accesses the home (http://hostname/ld/), datasets catalog is shown (In this case we only have the course dataset). At the same time, the servers does the transformation of raw data to linked data. For each transformed entity, four files are got(one for each serializarion format jsonld, ttl, n3 y csv) 
    -How to access the linked datasets? Datasets can be got from the catalog in the university home (http://hostname/ld/). The university catalog contains the dataset accessURl via dataset distributions. Datasets can be also got clicking the URL http://hostname/ld/{entityname in plurar} for instance http://hostname/ld/courses.
	-Clients can request different serialization formats such as jsonld, ttl, n3 y csv via content negotiation which is implemented in the component. Possible request=> response (accept=>Content-Type)variants are ”text/plain”=>ttl, ”text/n3”=> n3, ”text/csv”=>csv, ”application/json”=>jsonld. 
	-When the client requests the JSON LD format, a customized query has been implemented. This a proof of concept in order to show the benefitics this kinf of query can provide for course recommender apps. The URL template of this customized query is http://hostname/ld/courses?startDate={startDateQuery}&subject={subjectQuery} which means the client can query the server asking for courses that start after a target date and related to a target subject. This component sorts the courses that meet the requeriments in ascending order and deliver them fragment by fragment. Automatic client-server comunication can be carried out thank to Tree or Hydra vocabularies.  
    -Done fragmentation is leveraged by other clients that request the same query to the server. The fragment lifetime depends on the server cache.  
    -Fragments are stored into two possible directories: if the request URL template includs startDate and subject, then a new foulder is created in the fragments/both/ directory whose name is the value of the startDate and in turn, in this new directory, another foulder is created whose name is the value of the subject. Otherwise, a new foulder is created in the fragments/startDates/ directory whose name is the value of the startDate.
#### Instalation steps
    -Install tecnologies
		npm install @babel/polyfill 
		npm install express
		npm install morgan 
		npm install --save-dev @babel/core @babel/cli @babel/preset-env  
		npm install nodemon -D 
		npm install @babel/node -D 
		npm install n3
	-Create .babelrc file to specify Babel to work with novel javascript code
		{
		    "presets": [
  		      "@babel/preset-env"
  		  ]
		} 
	-Create the foulder src and the file src/index.js
	-Replace the following in the package.json file:
		"test": "echo \"Error: no test specified\" && exit 1" 
        =>	"dev":"nodemon src/index.js --exec babel-node",  
			"build": "babel src --out-dir dist",  
			"start":"node dist/index.js"	
	-To test the app:
		npm run dev
	-To put into production
		npm run build 
		npm start 
