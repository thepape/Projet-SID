function getReussiteColorScale(taux_reussite, min, max){

	var color = ((parseInt(taux_reussite+"") - min) / (max - min)) * 255;
	//console.log(min);
	color = Math.round(color);

	var rgb_object = {
		red: color,
		green: color,
		blue: 255
	}

	return rgb_object;
}

function getLastReussite(resLycee){
	
    var array = $.map(resLycee, function(value, index) {
	    return [value];
	});

	return array[array.length-1];
}

function getMinReussite(lycees, annee){
	var min = 100;

	for(var key in lycees){
        if(!lycees.hasOwnProperty(key)){
            continue;
        }

        var nom_lycee = key;
        var taux = parseInt(lycees[nom_lycee][annee]+"");

        
        if(taux < min){
        	min = taux;

        }
        
    }

    return min;
}

function constructLineChart(data){
	var ville = $("#input_ville").val();
    var filiere = $("#input_filiere").val();

	/////////////   construction du graphique
				d3.selectAll("#graphique > *").remove();
				$("#legende").empty();

				var graphique = d3.select("#graphique");
				var WIDTH = 600;
				var	HEIGHT = 500;
				var	MARGINS = {
						top: 20,
						right: 20,
						bottom: 20,
						left: 50
					};

					var scale = d3.scale;
					//console.log(d3.scaleLinear());

				//// axes

				var xScale = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2012,2015]);
				var yScale = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,100]);

				var xAxis = d3.axisBottom()
					.scale(xScale)
					.ticks(4);
				var yAxis = d3.axisLeft().scale(yScale);

				graphique.append("svg:g")
					.attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
					.call(xAxis);


				graphique.append("svg:g")
					.attr("transform", "translate(" + (MARGINS.left) + ",0)")
					.call(yAxis);



				///////////////////////////////////// lignes de dizaines


				var listeAnnees = [2012,2013,2014,2015];


				for(var i=10; i <= 100; i+=10){
					var lineDizaine = d3.line()
							.x(function(d){
								return xScale(d);
							})
							.y(function(d){
								return yScale(i);
							})

					graphique.append("svg:path")
							.attr("d", lineDizaine(listeAnnees))
							.attr("stroke","black")
							.attr("stroke-width", 0.1)
							.attr("fill","none");
				}



				//////////////////////////////////////////////// courbes


				var legende = new Array();
				

				//on dessine une courbe pour chaque lycée
				for(var key in data[filiere]){
					if(data[filiere].hasOwnProperty(key)){
						var objet = data[filiere][key];
						var nom_lycee = key;
						var couleur_lycee = getRandomColor();
						var tableau = new Array();
						var i = 0;

						legende[legende.length] = {
							lycee: nom_lycee,
							couleur: couleur_lycee
						};

						//transformation de l'objet en tableau
						for(var annee in objet){
							if(objet.hasOwnProperty(annee)){
								tableau[i] = {
									year: annee,
									rate: objet[annee]
								};
								i++;
							}
						}

			
						var line = d3.line()
							.x(function(d){
								return xScale(d.year);
							})
							.y(function(d){
								return yScale(d.rate);
							})

						graphique.append("svg:path")
							.attr("d", line(tableau))
							.attr("stroke",couleur_lycee)
							.attr("stroke-width", 2)
							.attr("fill","none");

						
						$("#legende").append('<li style="color:'+couleur_lycee+'">'+nom_lycee+'</li>');
					}
				}
}

function getData(){
			//on recupere le parametre ville
			var ville = $("#input_ville").val();
			var filiere = $("#input_filiere").val();
			

			var url = "services/reussite-courbes.php?filiere="+filiere;

			if(ville != ""){
				url += "&ville="+ville;
			}

			console.log(url);
			$.ajaxSetup({async: false});
			$.get(url, function(data){
			
				////construction du linechart
				constructLineChart(data);
				//geocodeAddressASYNC(data);

				


			}, "json");
			
			
			
		}