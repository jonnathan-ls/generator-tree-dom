$(document).ready( function(){

	// var arrayAllTags = new Array(); // DESNECESSÁRIO
	// var indexAllTags = 0; // DESNECESSÁRIO
	var arrayRamificacoes = new Array(); 
	var iG = 0; // indice Geral
	var iR = 0; // indice Ramificação
	var filho = undefined;
	
	var allTags = $('*'); // Seleciona todos os elementos da página.
	
	// TORNOU-SE DESNECESSÁRIO
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
	
	// TORNOU-SE DESNECESSÁRIO
	// Metodo para capturar nome das Tags de cada elemento de um objeto
	// 2º (Segundo) Método Desenvolvido !!!
	/*function capturarTags(objeto){
		// Enquanto i for menor que a quantidade de elementos do objeto:
		for (var i=0; i < objeto.length; i++){
			// Captura o nome do nó pertinente ao elemento do laço
			arrayAllTags[indexAllTags++] = objeto[i].nodeName;
			
		}
	}*/


	// Método para percorrer as propriedades de um objeto
	function propriedadesObjeto(objeto){
		var resultado = "";
		for (propriedade in objeto) {
			// Alimenta a string resultado com a propriedade e descrição
			resultado += propriedade + ": " + objeto[propriedade] + "<br>"; 
		};
		return resultado; 
	}
	
	
	// Método recursivo para buscar filhos de um objeto !!!
	// Conforme iteração, instancia um novo array dentro do arrayRamificações para cada nova ramificação
	function buscarFilhos(objeto){
		
		// Instancia um novo array se o arrayRamificação[indice Geral] for nulo
		if (arrayRamificacoes[iG] == undefined){ arrayRamificacoes[iG] = new Array(); }
		// Associa o nome do objeto atual a ao indice da ramificação atual
		arrayRamificacoes[iG][iR] = objeto; 

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
				arrayRamificacoes[iG][iR] = objeto;
				iG--;				
			}
			iG = aux; // Devolve o valor de iG original para seguir a lógica da função
			iR--;
		}		
	}

	// Método para obter as ramificações da arvore DOM da página HTML
	function obterRamificacoes(array){
		var texto = "";
		// Itera com a lista de tags 'arrayRamificações' (Objetos Collection)
		for (var i=0; i < array.length; i++){
			// Adiciona uma nova Tag dentro da Tag com o ID 'arvore'
			var tag = $('<pre>'); // cria um novo elemento
			tag.attr('id', 'r' + i); // adiciona um novo id
			tag.attr('class', 'col-xs-4 col-sm-1'); // adiciona uma nova class
			tag.append((i+1) + "º Raiz");
			$('#arvore').append(tag); // adiciona o elemento ao conteudo da tag com ID arvore

			
			// Para cada ramificação, irá obter o nome das tags na hierarquia
			// E adciona as tags ao elemento criado
			for (var j=0; j < array[i].length; j++){
				var tag = $('<button>');
				tag.attr('class', 'p' + j + ' btn-success btn-block');
				if(array[i][j].nodeName == 'HTML' || array[i][j].nodeName == 'HEAD' || array[i][j].nodeName == 'META' || array[i][j].nodeName == 'BODY'){
					tag.attr('disabled', 'disabled');
				}

				tag.append(array[i][j].nodeName);
				$('#r' + i).append(tag);
			}
		}
	}

	// Método para que quando algum botao dentro da Tag com id arvore for clicado:
	// captura o id de ramificação e classe desta (posicão);
	$(function(){
		$('#arvore button').on('click', function(){
		//$('#arvore button').click(function(){
			iR = ""; //Zera o conteudo do indice de Ramificação para receber um novo valor
			var posicao = $(this).attr('class');
			// Obtem o numero da ramificaççao (dentro do array GERAL)
			for(var i=1; posicao[i] != ' '; i++){ iR += posicao[i];	}
			iG = ""; // Zera o conteudo do indice Geral
			var ramificacao = $(this).parent().attr('id');
			// Obtem o numero da posicação (indice da ramificação atual)
			for(var i=1; ramificacao[i] != undefined; i++){	iG += ramificacao[i]; }
			// Chama a função modal para exibir o modalElemento passando como parametro o indice da Ramificação Geral (array)
			// e o indice da posicação no Array, que servira para acessar o objeto pertencente ao elemento clicado
			mostrarModalElemento(iG, iR); 
		});
	});


	// Método para inserir dentro da Tag com ID Arvore o conteudo e e atributos de um objeto;
	// Parametros de posicação iG indice Geral (ramificações) e iR indice da Ramificação (posicao)
	function mostrarModalElemento(iG, iR){ 
		$('#modalElemento .modal-body').html(''); // Limpa o conteudo contido para inserir um novo	
		$('#modalElemento').modal('show'); // Chama a janela que estava como MODAL

		// Cria uma nova tag, coloca os atributos e insere conteudo e atributos do objeto
		var tag = $('<div>');
		tag.attr('class', 'col-xs-12');
		var atributos = obterAttrsTag(arrayRamificacoes[iG][iR]);
		tag.append(atributos);
		tag.append('<hr>');
		tag.append(arrayRamificacoes[iG][iR].innerHTML);
		
		// Busca a altura do objeto passado e então ajusta a altura de onde será inserido o conteudo
		$('#modalElemento .modal-body').height(arrayRamificacoes[iG][iR].clientHeight + 300);
		$('#modalElemento .modal-body').append(tag); // Adiciona a tag criada ao body do modal
		
	}

	// Insere o conteudo (tags) necessárias para interagir com o algoritimo
	function inserirElementosNoBody(){

		var tag;		

		// Card que irá interagir com as funções de mostrar conteudo e atributos do objeto
		tag = $('<div>');
		tag.attr('class', 'modal');
		tag.attr('id', 'modalElemento');
		$('body').prepend(tag);

		// Container do modalElemento 
		tag = $('<div>');
		tag.attr('class', 'modal-content');
		$('#modalElemento').append(tag);

		// Cabeçalho do modalElemento
		tag = $('<div>');
		tag.attr('class', 'modal-header');
		tag.append('Conteudo e Propriedades do Elemento')
		tag.css('font-size', '25px')
		$('.modal-content').append(tag);

		// Corpo do modalElemnto
		tag = $('<div>');
		tag.attr('class', 'modal-body');
		$('.modal-content').append(tag);

		// Button para sair do modalElemento
		tag = $('<button>');
		tag.attr('class', 'btn btn-danger');
		tag.css('float', 'right')
		tag.attr('type', 'button')
		tag.on('click', function(){
			$('#modalElemento').modal('hide');
		});
		tag.append('Fechar');
		$('#modalElemento .modal-header').append(tag);


		// Cria o card que irá conter o Modal pertinente a Arvore DOM
		tag = $('<div>');
		tag.attr('class', 'modal');
		tag.attr('id', 'arvore');

		// Adiciona o card arvore ao body da pagina web
		$('body').prepend(tag);

		// cria o botão para mostrar a arvore DOM
		tag = $('<button>');
		tag.attr('class', 'btn btn-info btn-block');
		tag.attr('data-toggle', 'modal');
		tag.attr('data-target', '#arvore');
		tag.append('Mostrar');
		$('body').prepend(tag);

		// Esconde a barrra de rolagem do index
		$('html').css('overflow', 'hidden');
		// Habilita a barra de rolagem da arvore para sobrepor qualquer outra
		$('#arvore').css('overflow', 'scroll');

	}


	// Metodo para obter os atributos deum objet
	function obterAttrsTag(objeto){
		var conteudo = '';
		// para cada atributo no objeto acionará a variavel conteudo o atributo e a descrição
		$(objeto.attributes).each(function(){
			conteudo += (this.name + ': ' + this.value + '<br>');
		})
		return conteudo; 
	}

	

	// PROGRAMA PRINCIPAL A PARTIR DESTA LINHA = MAIN(){}

	buscarFilhos(allTags[0]);
	//capturarTags(allTags);  // DESNECESSÁRIO
	inserirElementosNoBody(); // Precisa vir antes de obter as ramificações para poder interagir com o algoritimo
	obterRamificacoes(arrayRamificacoes); 
	
});