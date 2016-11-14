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

function getColor(indice){
	colors = [ 
		"D00000",
		"F65700",
		"FFBC00",
		"FFFF34",
		"94D200",
		"30A71C",
		"00A86B",
		"0057A8",
		"3B00A8",
		"AC00DD",
		"DD00A6",
		"FF4076",

		"692323",
		"332217",
		"C3B15D",
		"3C643C",
		"5FD9A7",
		"5F81A0",
		"5D578A",
		"47344C",
		"560028"
	];

	return "#"+colors[indice];
}

function getLastReussite(resLycee){
	
    var array = $.map(resLycee, function(value, index) {
	    return [value];
	});

	return array[array.length-1];
}

function getLastYear(Lycee){
	var year = 0;

	for(annee in Lycee){
		if(!Lycee.hasOwnProperty(annee)){
			continue;
		}

		if(annee > year){
			year = annee;
		}
	}
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

function getMinReussite(lycees){
	var min = 100;

	for(var key in lycees){
        if(!lycees.hasOwnProperty(key)){
            continue;
        }

        var nom_lycee = key;

        for(var an in lycees[nom_lycee]){
        	if(!lycees[nom_lycee].hasOwnProperty(an)){
        		continue;
        	}
        	var taux = parseInt(lycees[nom_lycee][an]+"");

        	if(taux < min){
	        	min = taux;

	        }
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


				var min_rate = getMinReussite(data[filiere]);

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
				var indice_couleur = 0;
				

				//on dessine une courbe pour chaque lycée
				for(var key in data[filiere]){
					if(data[filiere].hasOwnProperty(key)){
						var objet = data[filiere][key];
						var nom_lycee = key;
						var couleur_lycee = getRandomColor();
						indice_couleur++;
						var tableau = new Array();
						var i = 0;

						var last_year = 0;
						var last_result = 0;

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

								last_year = annee;
								last_result = objet[annee];

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

						graphique.append("text")
							.attr("x", xScale(last_year)+7)
							.attr("y",yScale(last_result)+7)
							.attr("font-size", 12)
							.attr("fill", couleur_lycee)
							.text(indice_couleur);

							console.log(last_year+"-"+last_result);

						
						$("#legende").append('<li style="color:'+couleur_lycee+'">'+indice_couleur+'-'+nom_lycee+'</li>');
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

			$.ajaxSetup({async: false});
			$.get(url, function(data){
			
				////construction du linechart
				constructLineChart(data);
				//geocodeAddressASYNC(data);

				


			}, "json");
			
			
			
		}