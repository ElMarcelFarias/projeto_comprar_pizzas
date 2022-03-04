let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el)=> document.querySelector(el);
const cs = (el)=> document.querySelectorAll(el);  

//Listagem das pizzas
pizzaJson.map((item, index)=>{
  let pizzaItem = c('.models .pizza-item').cloneNode(true);
  // Preencher as informações em pizza item

  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.querySelector('a').addEventListener('click',(e)=>{
    e.preventDefault();
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key;

    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

    c('.pizzaInfo--size.selected').classList.remove('selected'); //Tirando a class select do tamanho das pizzas  
    
    cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{ 
      if(sizeIndex == 2){
        size.classList.add('selected');
      }// sizeIndex do tamanho grande é = 2, quanto o sizeIndex for igual a 2 então adicionar a classe .selected para deixar selecionado o tamanho grande na pizza

      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
    }); //Precisamos sempre resetar o modal


    c('.pizzaInfo--qt').innerHTML = modalQt;


    c('.pizzaWindowArea').style.opacity = 0;
    c('.pizzaWindowArea').style.display = 'flex';
    setTimeout(()=>{
      c('.pizzaWindowArea').style.opacity = 1;
    },200);
  } )

  c('.pizza-area').append(pizzaItem);

});

// Eventos do Modal

// Evento de fechar o modal para desktop e mobile
function closeModal() {
  c('.pizzaWindowArea').style.opacity = 0;
  setTimeout(()=>{
    c('.pizzaWindowArea').style.display = 'none';
  }, 500);
}


cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
  item.addEventListener('click', closeModal);
});

// Evento de quantidade de pizzas 
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{ 
  if(modalQt > 1){
    modalQt = modalQt - 1
    c('.pizzaInfo--qt').innerHTML = modalQt;
  } //Lógica para diminuir a quantidade de pizzas, para não serem negativas
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
  modalQt++;
  c('.pizzaInfo--qt').innerHTML = modalQt;
});

// Evento para selecionar o tamanho das pizzas

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
  size.addEventListener('click', (e)=>{
    c('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

// Evento para adicionar ao carrinho

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
  /*
  // Qual a pizza?
  console.log(`Pizza: ${modalKey}`);
  // Qual o tamanho selecionado?
  let size = c('.pizzaInfo--size.selected').getAttribute('data-key');
  console.log(`Tamanho: ${size}`);
  // Quantas pizzas?
  console.log(`Quantidade: ${modalQt}`);
  */
  let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
  
  //Verificação aula 10 para se caso deseja adicionar uma pizza com as mesmas especificações. 
  //para não gerar um novo item desnecessário no carrinho

  let indentifier = pizzaJson[modalKey].id+'@'+size;

  let key = cart.findIndex((item)=>item.indentifier == indentifier);

  if(key > -1){
      cart[key].qt += modalQt; 
  } else {
    cart.push({
      indentifier,
      id:pizzaJson[modalKey].id,
      size:size,
      qt:modalQt
    });
  }

  updateCart();
  closeModal();

}); //Colocar no carrinho 
 
c('.menu-openner').addEventListener('click', () => {
  if(cart.length > 0) {
    c('aside').style.left = 0;
  }
});

c('.menu-closer').addEventListener('click', () => {
  c('aside').style.left = '100vw';
});

function updateCart(){

  c('.menu-openner span').innerHTML = cart.length;

  if(cart.length > 0) {
    c('aside').classList.add('show');
    c('.cart').innerHTML = ''

    let subtotal = 0;
    let total = 0;
    let desconto = 0; 


    for (let i in cart){
      
      let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id)
      subtotal += pizzaItem.price * cart[i].qt;
      let cartItem = c('.models .cart--item').cloneNode(true);


      let  pizzaSize;
      switch(cart[i].size){
        case 0:
          pizzaSize = 'P';
          break;
        case 1:
          pizzaSize = 'M';
          break;
        case 2:
          pizzaSize = 'G';
          break;

      }
      let  pizzaName = `${pizzaItem.name} (${pizzaSize})`;

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
        if(cart[i].qt > 1){
          cart[i].qt--;
        } else {
          cart.splice(i, 1);
        }

        updateCart();
      });

      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
        cart[i].qt++;
        updateCart();
      }); 
      

      c('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

      c('.subtotal span:last-child').innerHTML = `R$: ${subtotal.toFixed(2)}`;
      c('.desconto span:last-child').innerHTML = `R$: ${desconto.toFixed(2)}`;
      c('.total span:last-child').innerHTML = `R$: ${total.toFixed(2)}`;

  } else {
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';
  }
}

