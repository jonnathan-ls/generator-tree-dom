$(document).ready( function(){
	var arrayAllTags = new Array(); 
	var indexAllTags = 0;
	var arrayRamificacoes = new Array();

	
	
	var allTags = $('*'); // Seleciona todos os elementos da página.

	
	// Metodo para capturar nome das Tags de cada elemento de um objeto
	// 1º (Primeiro) Método Desenvolvido !!!
	/*function capturarTags(objeto){
		$.each(objeto, function() {
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

	/*var Tag = function(nome, status){
		this.nome = nome;
		this.status = status;
	}
	var f1 = new Tag('teste', 1);
	alert(f1.nome);
	alert(f1.status);*/
	
	var iG = 0; // indice Geral
	var iR = 0; // indice Ramificação
	var filho = undefined;
	// Método recursivo para buscar filhos de um objeto !!!
	// Conforme iteração, instancia um novo array dentro do arrayRamificações para cada nova ramificação
	function buscarFilhos(objeto){
		// Instancia um novo array se o arrayRamificação[indice Geral] for nulo
		if (arrayRamificacoes[iG] == undefined){ arrayRamificacoes[iG] = new Array(); }
		// Associa o nome do objeto atual a ao indice da ramificação atual
		arrayRamificacoes[iG][iR] = objeto.nodeName; 
		// Se o objeto atual não possuir filhos, diminui o indice Ramificação
		// pois seu valor foi atualizado na ultima iteração, e atualiza o indice Geral 		
		if (objeto.childElementCount == 0){ iR--; iG++; }
		else{ // Se o objeto possuir filhos, itera sobre eles, chamando a função buscarFilho novamente
			for (var i = 0; i < objeto.childElementCount; i++){
				filho = objeto.children[i]; // Objeto atua, quem é seu filho[i] ?
				iR++; // Atualiza indice Ramificação, pois acrescentará um filho a ramificação atual
				buscarFilhos(filho);				
			}
			// Após terminar iteração entre os filhos:
			var aux = iG; // Salva o indice Geral em um variavel auxiliar
			iG--; // Decrementa o indice Geral 
			// Entre em laço para preencher os indices anteriores ao ultimo filho
			// Até que encontre o objeto Pai e assim retornar ao seus antepassados
			while(arrayRamificacoes[iG][iR] == undefined){
				arrayRamificacoes[iG][iR] = objeto.nodeName;
				iG--;				
			}
			iG = aux; // Devolve o valor de iG original para seguir a lógica da função
			iR--;
		}		
	}

	function adicionarTag(id, tag){
		$(id).append(tag);
	}

	function obterRamificacoes(array){
		var texto = "";
		for (var i=0; i < array.length; i++){
			adicionarTag('#arvore', '<div id="r' + i +'" class="col-xs-1"></div>');
			for (var j=0; j < array[i].length; j++){
				texto += array[i][j] + "<br>";
			}
			$('#r' + i).append(texto);
			texto = "";
		}
	}




	buscarFilhos(allTags[0]);
	capturarTags(allTags);

	//document.getElementById('teste').innerHTML = propriedadesObjeto(allTags);
	//document.getElementById('teste').innerHTML = obterRamificacoes(arrayRamificacoes);
	obterRamificacoes(arrayRamificacoes);

	var i = 0;
	while(arrayAllTags[i] != undefined){
		console.log(arrayAllTags[i++]);
	}	

});