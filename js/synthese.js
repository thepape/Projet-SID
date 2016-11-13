

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

	if(indice >= colors.length){
		return getRandomColor();
	}

	return "#"+colors[indice];
}

function getRandomColor() {
		    var letters = '0123456789ABCDEF';
		    var color = '#';
		    for (var i = 0; i < 6; i++ ) {
		        color += letters[Math.floor(Math.random() * 16)];
		    }
		    return color;
		}

function getMoyenneAcces(lycees){
	var somme = 0;
	var nb = 0;

	for(nom_lycee in lycees){
		if(!lycees.hasOwnProperty(nom_lycee)){
			continue;
		}

		var tx_seconde = parseFloat(lycees[nom_lycee]["tx_acces_seconde"]);
		var tx_premiere = parseFloat(lycees[nom_lycee]["tx_acces_premiere"]);

		somme += (tx_seconde + tx_premiere) / 2;

		nb++;
	}

	return somme / nb;
}

function getMinAcces(lycees){
	var min = 100;

	for(nom_lycee in lycees){
		if(!lycees.hasOwnProperty(nom_lycee)){
			continue;
		}

		var tx_seconde = parseFloat(lycees[nom_lycee]["tx_acces_seconde"]);
		var tx_premiere = parseFloat(lycees[nom_lycee]["tx_acces_premiere"]);

		var acces = (tx_seconde + tx_premiere) / 2;

		if(acces < min){
			min = acces;
		}
	}

	return min;
}

function getMoyenneReussite(lycees){
	var somme = 0;
	var nb = 0;

	for(nom_lycee in lycees){
		if(!lycees.hasOwnProperty(nom_lycee)){
			continue;
		}

		somme += parseFloat(lycees[nom_lycee]["tx_brut_reussite"]);
		nb++;
	}

	return somme / nb;
}

function getMinReussite(lycees){
	var min = 100;

	for(nom_lycee in lycees){
		if(!lycees.hasOwnProperty(nom_lycee)){
			continue;
		}

		var tx_reussite = parseFloat(lycees[nom_lycee]["tx_brut_reussite"]);

		if(tx_reussite < min){
			min = tx_reussite;
		}
	}

	return min;
}

function constructPointsChart(data){
	var ville = $("#input_ville").val();
    var niveau = $("#input_niveau").val();

	/////////////   construction du graphique
				d3.selectAll("#graphique > *").remove();
				$("#legende").empty();

				var acces_moyen = getMoyenneAcces(data);
				var reussite_moyenne = getMoyenneReussite(data);
				var acces_min = getMinAcces(data);
				var reussite_min = getMinReussite(data);

				var graphique = d3.select("#graphique");
				var WIDTH = 1000;
				var	HEIGHT = 700;
				var	MARGINS = {
						top: 20,
						right: 20,
						bottom: 20,
						left: 50
					};

					var scale = d3.scale;
					//console.log(d3.scaleLinear());

				//// axes

				var xScale = d3.scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([acces_min,100]);
				var yScale = d3.scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([reussite_min,100]);

				var xAxis = d3.axisBottom()
					.scale(xScale)
				var yAxis = d3.axisLeft().scale(yScale);

				graphique.append("svg:g")
					.attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
					.call(xAxis);


				graphique.append("svg:g")
					.attr("transform", "translate(" + (MARGINS.left) + ",0)")
					.call(yAxis);


				var listeY = [0,10,20,30,40,50,60,70,80,90,100];


				

				////////////////// lignes moyenne d'acces

				

				var lineAccesM = d3.line()
					.x(function(d){
						return xScale(acces_moyen);
					})
					.y(function(d){
						return yScale(d)
					})

					graphique.append("svg:path")
							.attr("d", lineAccesM(listeY))
							.attr("stroke","black")
							.attr("stroke-width", 0.5)
							.attr("fill","none");


				///////////////////// ligne moyennee reussite
				var lineReussiteM = d3.line()
					.x(function(d){
						return xScale(d);
					})
					.y(function(d){
						return yScale(reussite_moyenne)
					})

					graphique.append("svg:path")
							.attr("d", lineReussiteM(listeY))
							.attr("stroke","black")
							.attr("stroke-width", 0.5)
							.attr("fill","none");


				//////////////////////////////////////////////// courbes


				var legende = new Array();
				var indice_couleur = 0;

				//on dessine un point pour chaque lycée
				for(var nom_lycee in data){
					if(data.hasOwnProperty(nom_lycee)){
						var objet = data[nom_lycee];
						var couleur_lycee = getRandomColor(); //getColor(indice_couleur);
						//indice_couleur++;
						var tableau = new Array();
						var i = 0;

						legende[legende.length] = {
							lycee: nom_lycee,
							couleur: couleur_lycee
						};

						var taux_r = objet["tx_brut_reussite"];
						var taux_acces = (parseFloat(objet["tx_acces_seconde"]) + parseFloat(objet["tx_acces_premiere"])) / 2;
						taux_acces = parseFloat(taux_acces);

						var cx = xScale(taux_acces);
						var cy = yScale(taux_r);

						console.log(cy + " "+cy);

						graphique.append("circle")
							.attr("cx", xScale(taux_acces))
							.attr("cy",yScale(taux_r))
							.attr("stroke",couleur_lycee)
							.attr("fill",couleur_lycee)
							.attr("r", 5);

						graphique.append("text")
							.attr("x", xScale(taux_acces)+7)
							.attr("y",yScale(taux_r)+14)
							.attr("font-size", 12)
							.attr("fill", couleur_lycee)
							.text(indice_couleur);

						
						$("#legende").append('<li class="li_legende" style="color:'+ couleur_lycee+'">'+indice_couleur+'-'+nom_lycee+'</li>');
						indice_couleur++;
					}
				}
}

function getData(){
			//on recupere le parametre ville
			var ville = $("#input_ville").val();
			var filiere = $("#input_filiere").val();

			var annee = $("#input_annee").val();
			

			var url = "services/synthese.php";

				url += "?ville="+ville+"&filiere="+filiere+"&annee="+annee;
			

			console.log(url);
			$.ajaxSetup({async: false});
			$.get(url, function(data){

				console.log(data);
			
				////construction du linechart
				constructPointsChart(data);
				//geocodeAddressASYNC(data);

				


			}, "json");
			
			
			
		}