$(document).ready( function(){
	var arrayAllTags = new Array(); 
	var indexAllTags = 0;
	var totalTags= 0;
	
	var allTags = $('*'); // Seleciona todos os elementos da página.

	
	// Metodo para capturar nome das Tags de cada elemento de um objeto
	// 1º (Primeiro) Método Desenvolvido !!!
	/*function capturarTags(objeto){
		$.each(objeto, function() {
			for (objeto in lista){
				arrayAllTags[indexAllTags] = objeto.nodeName;
			}
			var conteudo = this; // a variavel faz referencia ao elemento da vez
			var str = conteudo + ''; // converte o elemento para uma string
			var tag = '';
			for (var i=12; str[i] != 'E'; i++){ // captura os caracteres desejados
				tag += str[i]; // unifica os caracteres formando a tag do elemento
			}
			arrayAllTags[indexAllTags] = tag; indexAllTags++; // adiciona a tag ao array de Tags
			totalTags++;
		});
	}*/
	
	
	// Metodo para capturar nome das Tags de cada elemento de um objeto
	// 2º (Segundo) Método Desenvolvido !!!
	function capturarTags(objeto){
		// Enquanto i for menor que a quantidade de elementos do objeto:
		for (var i=0; i < objeto.length; i++){
			// Captura o nome do nó pertinente ao elemento do laço
			arrayAllTags[indexAllTags++] = objeto[i].nodeName;
			totalTags++; // Atualiza quantidade de Tags
		}
	}

	// Método para percorrer as propriedades de um objeto
	function propriedadesObjeto(objeto){
		var resultado = "";
		for (propriedade in objeto) {
			// Alimenta a string resultado com a propriedade e descrição
			resultado += propriedade + ": " + objeto[propriedade] + "<br>"; 
		};
		return resultado; 
	}



	document.getElementById('teste').innerHTML = propriedadesObjeto(allTags[6]);

	capturarTags(allTags);

	var i = 0;
	while(arrayAllTags[i] != undefined){
		console.log(arrayAllTags[i++]);
	}	

});