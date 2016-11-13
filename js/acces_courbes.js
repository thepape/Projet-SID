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

function calculerMoyenne(objet_liste_taux){
	var somme = 0;
	var denominateur = 0;

	for(taux in objet_liste_taux){
		if(!objet_liste_taux.hasOwnProperty(taux)){
			continue;
		}

		var valeur = objet_liste_taux[taux];

		if(taux == "tx_acces_terminale"){
			continue;
		}

		somme += parseFloat(valeur);
		denominateur += 1;
	}

	console.log(somme);

	if(denominateur > 0){
		return somme / denominateur;
	}
	else{
		return -1;
	}
}

function constructLineChart(data){
	var ville = $("#input_ville").val();
    var niveau = $("#input_niveau").val();

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
				var indice_couleur = 0;

				//on dessine une courbe pour chaque lycée
				for(var nom_lycee in data){
					if(data.hasOwnProperty(nom_lycee)){
						var objet = data[nom_lycee];
						var couleur_lycee = getColor(indice_couleur);
						indice_couleur++;
						var tableau = new Array();
						var i = 0;

						legende[legende.length] = {
							lycee: nom_lycee,
							couleur: couleur_lycee
						};



						//transformation de l'objet en tableau
						for(var annee in objet){
							if(objet.hasOwnProperty(annee)){
								var taux_acces = null;

								//////on fait en fonction du niveau choisi
								if(niveau == "moyenne"){
									taux_acces = calculerMoyenne(objet[annee]);
								}
								else{
									taux_acces = objet[annee]["tx_acces_"+niveau];
								}

								tableau[i] = {
									year: annee,
									rate: taux_acces
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
			var niveau = $("#input_niveau").val();
			

			var url = "services/acces-courbes.php";

			if(ville != ""){
				url += "?ville="+ville;
			}

			console.log(url);
			$.ajaxSetup({async: false});
			$.get(url, function(data){

				console.log(data);
			
				////construction du linechart
				constructLineChart(data);
				//geocodeAddressASYNC(data);

				


			}, "json");
			
			
			
		}