# Component name: coursesld_server
## Dependencies: rawdata_api component
## Tecnologies: nodejs, express, morgan,
## Configuration files:
	-config_files/server_config.js 
		module.exports = {
		    protocol: 'http',
		    hostname: 'localhost:3000',
		    port: 3000,
		}
	-skeleton.jsonld. Hydra vocabulary template.
	-skeleton_tree.jsonld. Tree vocabulary template.

## Inputs files: 
	-files/raw_data/*.json. Raw data of entities to be transformed in JSON format. In this case files/raw_data/courses.json.
	-files/ld/ontologies/courseontology.ttl. Course ontology needed to transfor course raw data to linked courses.
	-fragments/both/ and fragments/startDates. Directories needed to save fragments of course customized query.
	-files/ld/. Directory needed to save linked entities.

## Outputs files: 
	-files/ld/entityname/entityname.jsonld, files/ld/entityname/entityname.ttl, files/ld/entityname/entityname.n3, files/ld/entityname/entityname.csv. For each entity its transformation on four formats is obtained (json ld, turtle, n triples y csv). In this case, course datset is the only datset obtained.
	-fragments/both/*, fragments/startDates/* directories. When a client requests the dataset course on JSON LD format, the customized interface splits the dataset into fragments and saves them in previos directories.
## Objectives: 
    -Publishing university entities as linked data. In this proof of concept, we only have linked courses. 

##  Explanation
	-A back end component to publish university courses as linked data in order for being consumed by client apps like course recommender apps.
	-The entrypoint src/index.js file calls src/app.js where prefixes of each module of the API are set up.
    -Where the client accesses the home (http://hostname/ld/), datasets catalog is shown (In this case we only have the course dataset). At the same time, the servers does the transformation of raw data to linked data. For each transformed entity, four files are got(one for each serializarion format jsonld, ttl, n3 y csv) 
    -How to access the linked datasets? Datasets can be got from the catalog in the university home (http://hostname/ld/). The university catalog contains the dataset accessURl via dataset distributions. Datasets can be also got clicking the URL http://hostname/ld/{entityname in plurar} for instance http://hostname/ld/courses.
	-Clients can request different serialization formats such as jsonld, ttl, n3 y csv via content negotiation which is implemented in the component. Possible request=> response (accept=>Content-Type)variants are ”text/plain”=>ttl, ”text/n3”=> n3, ”text/csv”=>csv, ”application/json”=>jsonld. 
	
    -Para la consulta del dataset en el formato jsonld se tiene una consulta optimizada con el objetivo de 	evitar sobrecargas de memoria y contribuir a la reutilización de los datos, donde el cliente 	puede precisar una fecha en la url de la petición, para solicitar los cursos que comiencen a partir de esa fecha y un subject. Para ello se tiene la plantilla de la URL http://hostname/ld/courses?startDate={startDateQuery}&subject={subjectQuery}. Los cursos resultantes de la consulta son ordenados 	de forma ascendente por el campo fecha de inicio y divididos en fragmentos de no más de 100 	cursos. 	Utilizando el vocabulario Tree, el cliente es capaz de acceder a cada uno de los fragmentos.
	-El servidor aprovecha la fragmentación realizada para atender otras peticiones con iguales urls. El 	tiempo de duración de la fragmentacion está en correspondencia con la caché del servidor.
	-Los fragmentos en el servidor son almacenados en dos destinos posibles, i) si la URL template 	comprende los campos startDate y subject o solo el campo subject, en el directorio fragments/both/ 	se crea un directorio cuyo  nombre es el valor del campo  startDate (se utilizara la fecha actual en la 	consulta cuando no se explicite el campo startDate en la consulta) y dentro se crea otro directorio 	cuyo nombre es el valor del campo subject donde son almacenados los fragmentos., ii) si la URL 	template comprende solo el campo startDate, en el directorio fragments/startDates/ se crea un 	directorio cuyo nombre es el valor del campo startDate donde son almacenados los fragmentos. 

Pendiente
	-Interfaz visual del componente
	-Separación de los componentes y subida del código a repositorios.
	-De alguna manera debo explicar en el catalogo dcat la manera de utilizar la URI template, es decir 	que un cliente conozca a partir de ver el dataset de cursos en el catalogo que la URI template abarca 	un campo startDate, etc. del dataset 	de los cursos. Creo que es en el campo conforme que se 	pone la explicación Hydra de la API o algo 	semejante en Tree.
	-En la implementación del ldcourse.controller cuando me quedo con los cursos por subject o a partir de la fecha, probar usando las funciones map o filter sobre los arreglos.

Manual de instalación
	-Carpeta del proyecto  coursesld_server abierta en el visual studio code
	-Crear fichero package.json del proyectos
		npm init -y
	-Instalamos las dependencias del proyecto
		npm install @babel/polyfill // babel es un compilador de código para java script
		npm install express
		npm install morgan 
		npm install --save-dev @babel/core @babel/cli @babel/preset-env  //relacionadas con babel
		npm install nodemon -D  //dependencias para el desarrollo
		npm install @babel/node -D //dependencias para el desarrollo
		npm install n3
	-Se crea el fichero .babelrc con el código que aparece abajo para especificarle a babel que se va a 	traducir código java script moderno
		{
		    "presets": [
  		      "@babel/preset-env"
  		  ]
		} 
	-Creamos la carpeta src en el proyecto y dentro un fichero index.js con el codigo siguientes
	-Reemplazamos en el fichero package.json lo siguiente
		"test": "echo \"Error: no test specified\" && exit 1" //Reemplazar por lo de abajo
			"dev":"nodemon src/index.js --exec babel-node",  
			"build": "babel src --out-dir dist",  
			"start":"node dist/index.js"	//ejecutar para poner en producción
	-Con las tres líneas incorporadas se expresa: i) en etapa de desarrollo, lo que se ejecutaría con 	nodemon ahora ejecutarlo con 	babel-node, ii) que el código desarrollado en el directorio “src” irá 	compilado para el directorio “dir” como código para producción, iii) Ejecutar en producción el 	código compilado que aparece en el directorio “dir”.
	-Probar la aplicación, ejecutar en consola
		npm run dev
	-Copiando el código del proyecto que incluye las carpetas y ficheros siguientes:
		dist
		config_files(server_config.js, skeleton_tree.jsonld, skeleton.jsonld)
		files/raw_data (courses.json), 
		files/ld, 
		files/ld/ontologies/courseontology.ttl
		fragments/both
		fragments/startDates
		public/courses_materials
		sql(backup.sql, db.sql)
		src(controllers , database, models, routes, app.js, index.js)
	-Cuando se quiere poner en producción el código
		npm run build //compilamos el código
		npm start //ejecutamos el código compilado	
