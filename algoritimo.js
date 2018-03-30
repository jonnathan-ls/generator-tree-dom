$(document).ready( function(){

	// var arrayAllTags = new Array(); // DESNECESSÁRIO
	// var indexAllTags = 0; // DESNECESSÁRIO
	var arrayRamificacoes = new Array(); 
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
	function obterPropriedadesObjeto(objeto){
		var resultado = "";
		for (propriedade in objeto) {
			// Alimenta a string resultado com a propriedade e descrição
			resultado += propriedade + ": " + $(objeto).attr(propriedade) + "<br>"; 
		};
		return resultado; 
	}
	
	
	// Método recursivo para buscar filhos de um objeto !!!
	// Conforme iteração, instancia um novo array dentro do arrayRamificações para cada nova ramificação
	var iG = 0; // indice Geral
	var iR = 0; // indice Ramificação
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
	function projetarRamificacoes(array){
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
	}

	// Método para itegir em laço a partir de uma Tag (Objeto) e partir ir construindo a ramificação atual na arvore.
	var iA = 2; // indice da Arvore;
	var iF = 0; // indice do Filho; 
	var arrayFilhos = new Array(); // Instancia um novo array para guardar os filhos de objeto atual (indice da ramificação)
	var arrayRamificacao = new Array();	// Instancia um novo array para guardar o objeto no indice N da arvore
	
	function arvoreDOM(objeto, local){
		arrayFilhos = {}; // Limpa o array para receber novos filhos
		iF = 0; // limpa o indice que irá interagir com o arrayFilhos
		$(local).html(''); // Limpa o conteudo do local vigente para sobrepor a ramificação, caso o usuário clique no objeto de hierarquia antecedente

		// cria uma nova tag e insere dentro dela o nome do objeto
		var tag = $('<button>');
		tag.attr('value', iR);
		tag.css({
			margin: '5px'
		});
		tag.html(objeto.nodeName);

		// cria uma nova tag com os atributos e conteudo do objeto
		var info = $('<a>');
		info.html('<br>Atributos e Conteudo');
		info.css({
			margin: '3px'
		});
		// Se o objeto atual for clicado, chama a janela modalElemento e insere os atributos, CSS e conteudo deste objeto.
		info.on('click', function(){

			$('#modalElemento .meContent .meHeader').html('< ' + objeto.nodeName +' >'); 
			$('#modalElemento .meBody').html(''); // Limpa o conteudo contido para inserir um novo	
			$('#modalElemento').modal('show'); // mostra a janela que estava como MODAL
			$('#modalElemento .meBody').append('<h3>Atributos: </h3>');
			$('#modalElemento .meBody').append(obterAttrsTag(objeto));
			$('#modalElemento .meBody').append('<hr><h3>Conteudo innerHTML: </h3>');
			// Se o objeto atual for HTML, HEAD ou Body, o conteudo não será exibido pois trava o algoritimo
			if (objeto.nodeName == 'HTML' || objeto.nodeName == 'HEAD' || objeto.nodeName == 'BODY'){
				$('#modalElemento .meBody').append('Não está Disponivel');
			}else{
				// Frame contendo estilo da Tag <pre> pois se utiliza-la o layout do conteudo Inner HTML fica totalmente diferente;
				var content = $('<div>');
				content.css({
					'border-radius': '5px',
					'background': '#F7F7F7',
					'border': '1px solid #D8D8D8',
					padding: '7px',

				});
				content.append(objeto.innerHTML); // Adiciona o conteudo interno da TAG dentro do content
				$('#modalElemento .meBody').append(content); // Adiciona ao Corpo do ModalElemento
			}
			$('#modalElemento .meBody').append('<hr><h3>Cascading Style Sheet: </h3>');
			// Cria uma nova Tag input que servira de textbox para pesquisar algum atributo CSS
			var inputCSS = $('<input>');
			inputCSS.attr({
				class: 'form-control',
				id: 'inputCSS',
				type: 'text',
				placeholder: 'Pesquisar'
			});
			
			$('#modalElemento .meBody').append(inputCSS);
			
			$('#modalElemento .meBody').append('<br>');
			// Cria uma nova TAG onde receberá o conteudo (string) retornado da função obterCSS
			var content2 = $('<pre>');
			content2.css('height', '400px');
			content2.append('<span id="titleBoxPesquisa">texto para informação de pesquisa</span>');
			content2.append(obterCssTag(objeto));
			$('#modalElemento .meBody').append(content2);
			// Torna o display da TAG com o conteudo CSS não disponivel
			$('#modalElemento ul').css('display', 'none');
			// Fonte do Metodo Abaixo: https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_filters_list&stacked=h
			// Para cada que for pressionada quando o input estiver em focus, irá percorrer cada elemento da lista (ul),
			// Pela qual possui todas os atributos CSS da Tag e caso não for identificado a letra na linha, deixa ela como indisponivel,
			// Deixando assim, visivel apenas as linhas cujo conteudo digitado foi encontrado
			$("#inputCSS").on("keyup", function() {
				var value = $(this).val().toLowerCase();
				$("#listCSS li").filter(function() {
					$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
				});
				// Implementado: pois se o input estiver vazi, torna invisivel o content
				if (inputCSS.val() == ''){
					$('#modalElemento #titleBoxPesquisa').css('display', 'block');
					$('#modalElemento ul').css('display', 'none'); // Implementei
				} 
				else { // Porém se não estiver vazio, torna:
					$('#modalElemento #titleBoxPesquisa').css('display', 'none');// Deixa invisvel o texto que faz referencia a consulta se não tiver nada digitado
					$('#modalElemento ul').css('display', 'block'); // Visivel o display onde esta os atributos CSS
				} 
			});
		});
		$(local).append(tag); // adiciona o botao com o nome da tag
		$(local).append(info); // Adiciona o link para acesso a janela modalElemento

		// Cria um novo escopo (DIV) para receber os filhos do objeto
		var novoLocal = $('<div>');
		$(local).append(novoLocal);
		arrayRamificacao[iR++] = objeto; // Guarda o objeto atual no arrayRamificao
		// Se o objeto atual for clicado, limpa o conteudo do HTML para soprer a rafmicação até então existente
		tag.on('click', function(){
			// Se recoloca dentro do escopo e exibi seus filhos
			iR = $(this).attr('value');
			arvoreDOM(arrayRamificacao[$(this).attr('value')], local);
		});
		var qtde = objeto.childElementCount; // qtde de filhos do objeto
		if (qtde > 0 ){ // Se for maior que zero
			if (objeto.nodeName == 'BODY'){
				var i = 3; 
				iF = 3;
				qtde--;
			}else{
				var i = 0;
			}
			// Iterage com cada filho para adiciona-los no novo local criado
			for (; i<qtde; i++){
				var tag = $('<button>');
				tag.attr('value', iF++);// Atribui um valor a TAG, para que se a TAG for clicada busque o filho correspondente...
				// ... no array que foi atualizado para mais abaixo passar como parametro da função que será chamada novamente
				// 
				tag.css('margin', '5px');
				filho = objeto.children[i]; // Pega o filho atual da interação
				arrayFilhos[i] = filho; // Adiciona o filho ao arrayFilhos
				tag.html(filho.nodeName);
				$(novoLocal).append(tag);
				// Se alguns dos filhos for clicado, chama a função como recursividade
				tag.on('click', function(){	
					arvoreDOM(arrayFilhos[$(this).attr('value')], novoLocal);
				});
			}
		}
		else{ // Se não possuir filhos, exibe informação
			$(novoLocal).html('Não tem filhos');
		}
	}


	// Metodo para obter os atributos relativo ao CSS do objeto passado (TAG);
	function obterCssTag(objeto){
		var conteudo = '<ul id="listCSS">'; // Conteudo irá ficar dentro de uma lista
		for (atributo in objeto.style){
			if (atributo == 'cssText') continue;
			// Pois o LI servirá para interagir com o mecanisco de busca do atributo desejado;
			conteudo += '<li><strong>' + atributo + '</strong>: ' + $(objeto).css(atributo) + '</li>';
		}
		conteudo += '</ul>';
		return conteudo;
	}
	

	// Método para inserir dentro da Tag com ID Arvore o conteudo e e atributos de um objeto;
	// Parametros de posicação iG indice Geral (ramificações) e iR indice da Ramificação (posicao)
	function mostrarModalElemento(iG, iR){ 
		$('#modalElemento .meBody').html(''); // Limpa o conteudo contido para inserir um novo	
		$('#modalElemento').modal('show'); // Chama a janela que estava como MODAL

		var altura = 0;
		// Cria uma nova tag, coloca os atributos e insere conteudo e atributos do objeto
		var tag = $('<div>');
		tag.attr('class', 'col-xs-12');
		
		// obtem os atributos do objeto
		var atributos = obterAttrsTag(arrayRamificacoes[iG][iR]);
		tag.append('<h3>Atributos:<h3> ');
		
		tag.append(atributos);
		$('#modalElemento .meBody').append(tag); 
		altura = tag.innerHeight();
		
		tag = $('<div>');
		tag.attr('class', 'col-xs-12');
		tag.css('float', 'right');
		tag.append('<hr><h3>Conteudo innerHTML:<h3> ');
		tag.append(arrayRamificacoes[iG][iR].innerHTML);
		$('#modalElemento .meBody').append(tag);
		altura += tag.innerHeight();
		// Busca a altura do objeto passado e então ajusta a altura de onde será inserido o conteudo
		$('#modalElemento .meBody').height(altura);
	}

	// Insere o conteudo (tags) necessárias para interagir com o algoritimo
	function inserirElementosNaPagina(){

		var tag;		

		// Card que irá interagir com as funções de mostrar conteudo e atributos do objeto
		tag = $('<div>');
		tag.attr('class', 'modal');
		tag.attr('id', 'modalElemento');
		$('body').prepend(tag);

		// Container do modalElemento 
		tag = $('<div>');
		tag.attr('class', 'meContent');
		tag.css({
			margin: '20px',
			padding: '20px',
			background: 'white',
			'border-radius': '10px',
		});
		$('#modalElemento').append(tag);

		// Button para sair do modalElemento
		tag = $('<button>');
		tag.attr({
			class: 'btn btn-danger',
			type: 'button'
		});
		tag.css({
			'border-radius': '30px',
			float: 'right',
			margin: '-10px -10px 0px 0px'
		});
		tag.on('click', function(){
			$('#modalElemento').modal('hide');
		});
		tag.append('X');
		$('#modalElemento .meContent').append(tag);

		// Cabeçalho do modalElemento
		tag = $('<div>');
		tag.attr('class', 'meHeader');
		//tag.append('Atributos e Conteudo do Elemento')
		tag.css('font-size', '25px')
		$('.meContent').append(tag);

		// Corpo do modalElemnto
		tag = $('<div>');
		tag.attr('class', 'meBody');
		tag.css('font-size', '18px')
		$('.meContent').append(tag);

		// Cria o card que irá conter o Modal pertinente a Arvore DOM
		tag = $('<div>');
		tag.attr('class', 'modal fade');
		tag.css({
			'text-align': 'center',
			margin: '22px 0px 0px 0px'
		});
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
		$('.modal-backdrop in')

		

		// Adiciona a tag Style ao Head para conter o CSS da Arvore 
		var style = $('<style>')
		style.attr('type', 'text/css');
		style.html('#arvore button:hover{ background: white; color: black; } #arvore a{	color: white; } #modalElemento h3{ color: blue; }');
		$('head').append(style);

		// Se a DIV da arvore receber algum clique desabilita o scrool do index e deixa o scrool dela como auto.
		$('#arvore').click(function(event) {
			$('html').css('overflow', 'hidden');
			$('#arvore').css('overflow', 'auto');
		});

	}


	// Metodo para obter os atributos deum objet
	function obterAttrsTag(objeto){
		var conteudo = '';
		// para cada atributo no objeto acionará a variavel conteudo o atributo e a descrição
		$(objeto.attributes).each(function(){
			conteudo += ('<strong>' + this.name + '</strong>: ' + this.value + '<br>');
		})
		/*// Metodo alternativo retorna todos os atributos, mesmo que seja 'undefined':
		for (atributo in objeto){
			conteudo += ('<strong>' + atributo + '</strong>: ' + $(objeto).attr(atributo) + '<br>');
		}*/
		return conteudo; 
	}


	// PROGRAMA PRINCIPAL A PARTIR DESTA LINHA = MAIN(){}
	// 
	//buscarFilhos(allTags[0]); // DESNECESSÁRIO
	//capturarTags(allTags);  // DESNECESSÁRIO
	inserirElementosNaPagina(); // Precisa vir antes de obter as ramificações para poder interagir com o algoritimo
	//projetarRamificacoes(arrayRamificacoes); // ALTERNATIVA para mostrar todas as ramificações
	iR = 0; // Atualiza o indice Ramificação pois pode estar com valor diferente
	arvoreDOM(allTags[0], '#arvore'); 

	
	
});