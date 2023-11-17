window.routes = {
  cart_add_url: '/cart/add',
  cart_change_url: '/cart/change',
  cart_update_url: '/cart/update.js',
  cart_url: '/cart'
};



class addToCartForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.submitButton = this.querySelector('[type="submit"]');
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

    this.handleErrorMessage();
    this.submitButton.setAttribute('aria-disabled', true);
    this.submitButton.classList.add('loading');
    this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];

    const formData = new FormData(this.form);
    config.body = formData;
    

    fetch(`${routes.cart_add_url}`, config)
    .then((response) => response.json())
    .then((response) => {
      if (response.status) {
        this.handleErrorMessage(response.description);

        const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
        if (!soldOutMessage) return;
        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.querySelector('span').classList.add('hidden');
        soldOutMessage.classList.remove('hidden');
        this.error = true;
        return;
      }

      this.error = false;
      document.querySelector('cart-drawer-items').renderCart();
      setTimeout((e) => {
        document.querySelector('.header .js-drawer-open-right').click();
      },350);
     // console.log(response);//success
    })
    .catch((e) => {
      console.error(e);
    })
    .finally((evt) => {
      this.submitButton.classList.remove('loading');
      if (!this.error) this.submitButton.removeAttribute('aria-disabled');
      this.querySelector('.loading-overlay__spinner').classList.add('hidden');
      
      //remove loading class form sticky add to cart button
      let stickyAddBtn = document.querySelector('.stikey-add-to-cart .main-add [data-type="sticky-add-cart"]') || null;
      if(stickyAddBtn){
        stickyAddBtn.classList.remove('loading');
        stickyAddBtn.querySelector('.loading-overlay__spinner').classList.add('hidden');
        if (!this.error) stickyAddBtn.removeAttribute('aria-disabled');
      }
      
    });
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
    if (!this.errorMessageWrapper) return;
    this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

    this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
}

customElements.define('product-form-drawer', addToCartForm);



class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.drawerOpen();
    this.drawerClose();
    this.cartNoteToggle();

    setTimeout((e) => {
      discountMutationObserver();      
      dCartDsicount(document.querySelector('.cart-drawer-footer .scDiscount__container form .sc_simple-container .sc_code-btn'));
      if(upsellSlider != undefined){
        upsellSlider(); 
      }
    },250);

    this.drawerHeight();
  }

  classToggel(el, ...args){
    args.map(e => el.classList.toggle(e))
  }

  drawerOpen(){
    const drawerOpen = document.querySelector('.js-drawer-open-right') || null;
    if(drawerOpen){
      drawerOpen.addEventListener('click', (e) => {
        e.preventDefault();
        //if(this.querySelector('cart-drawer-items')) this.querySelector('cart-drawer-items').renderCart();
        document.querySelectorAll('#CartDrawer, #PageContainer').forEach(ele => {
          ele.classList.add('is-transitioning');
        });
        document.body.classList.add('js-drawer-open', 'js-drawer-open-right');
        setTimeout((e) => {
          document.querySelector('cart-drawer').drawerHeight();
        },500);        
      });
    }
  }

  drawerClose(){
    const drawerClose = document.querySelector('.js-drawer-close button') || null;
    const _drawerClose = document.querySelector('.fe-cta-cs-btn') || null;
    
    if(drawerClose){
      drawerClose.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('#CartDrawer, #PageContainer').forEach(ele => {
          ele.classList.remove('is-transitioning');
        });
        document.body.classList.remove('js-drawer-open', 'js-drawer-open-right');
      });
    }
    if(_drawerClose){
      _drawerClose.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('#CartDrawer, #PageContainer').forEach(ele => {
          ele.classList.remove('is-transitioning');
        });
        document.body.classList.remove('js-drawer-open', 'js-drawer-open-right', 'pop-open-editnote');
      });
    }
    //outside click close drawer
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('is-moved-by-drawer', 'is-transitioning')) {
        document.querySelectorAll('#CartDrawer, #PageContainer').forEach(ele => {
          ele.classList.remove('is-transitioning');
        });
        document.body.classList.remove('js-drawer-open', 'js-drawer-open-right', 'pop-open-editnote');
      }
    });
    
  }
  
  drawerHeight(){
    $('#CartDrawer .ajaxcart__inner').css('height','');
    /*var _othersHeight = $('#CartDrawer .Drawer__Header').outerHeight(true) + $('#CartDrawer .header_free_shipbar').outerHeight(true) + $('#CartDrawer .cart-drawer-footer').outerHeight(true);*/
    var _othersHeight = 0;
    
    if($('#CartDrawer .header_free_shipbar').length > 0){
    	var _arrayOfHeight = ['#CartDrawer .Drawer__Header','#CartDrawer .header_free_shipbar','#CartDrawer .cart-drawer-footer'];
    }else{
    	var _arrayOfHeight = ['#CartDrawer .Drawer__Header','#CartDrawer .cart-drawer-footer'];
    }
    
    for( var i = 0; i< _arrayOfHeight.length; i++ ){
      if( $(_arrayOfHeight[i]).length > 1){
        $(_arrayOfHeight[i]).each(function(index, item){
          _othersHeight = _othersHeight + $(item).outerHeight(true);
        });
      }else{
        _othersHeight = _othersHeight + $(_arrayOfHeight[i]).outerHeight(true);
      }
    }
    var _finalHeight = $(window).height() - _othersHeight;
    if( _finalHeight > 0 ){
      $('#CartDrawer .ajaxcart__inner').css('height', _finalHeight+'px');
    }
  }

  cartNoteToggle(){
    const cartNoteToggle = document.querySelectorAll('.Cart__NoteButton') || null;
    if(cartNoteToggle){
      cartNoteToggle.forEach(ele => {
        ele.addEventListener('click', (e) => {
          e.preventDefault();
          document.body.classList.toggle('pop-open-editnote');
        });
      })
    }
  }

}

customElements.define('cart-drawer', CartDrawer);



class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      this.closest('cart-drawer-items').updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);



class CartDrawerItem extends HTMLElement {
  constructor() {
    super();
    
    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
    .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);
    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }
  
  onChange(event) {
    //console.log('line--',event.target.dataset.index, 'value--',event.target.value);
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }
  
  classToggel(el, ...args){
    args.map(e => el.classList.toggle(e))
  }
  
  renderCart() {
    fetch(`${window.routes.cart_url}?view=ajax`)
    .then((response) => response.text())
    .then((responseText) => {      
      const html = new DOMParser().parseFromString(responseText, 'text/html');
      //console.log(html);
      const source = html.querySelector('cart-drawer-items') || null;
      const header = html.querySelector('.header_free_shipbar') || null;
      const footerSource = html.querySelector('.ajaxcart__footer__bottom') || null;
      const totalQtyAdded = html.querySelector('.cartQty') || null;
      if(totalQtyAdded) document.querySelector('.header .cart-count-bubble span:first-child').textContent = totalQtyAdded.value
      if(header) document.querySelector('.header_free_shipbar').innerHTML = header.innerHTML;
      if(source) document.querySelector('cart-drawer-items').innerHTML = source.innerHTML;
      if(footerSource) document.querySelector('.ajaxcart__footer__bottom').innerHTML = footerSource.innerHTML;
      if(!source && !footerSource) document.getElementById('CartContainer').innerHTML = html.getElementById('CartContainer').innerHTML;
      document.getElementById('CartContainer').classList.value = html.getElementById('CartContainer').classList.value;
	  document.getElementById('CartDrawer').classList.value = html.getElementById('CartDrawer').classList.value;
      this.closest('cart-drawer').cartNoteToggle();
      this.closest('cart-drawer').drawerHeight();
      setTimeout((e) => {
        discountMutationObserver();
        dCartDsicount(document.querySelector('.cart-drawer-footer .scDiscount__container form .sc_simple-container .sc_code-btn'));
        if(upsellSlider != undefined){
          upsellSlider();
        }
      },250);
      
    });
  }

  updateQuantity(line, quantity, name) {
    this.enableLoading(line);
    const body = JSON.stringify({
      line,
      quantity
    });
    fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
    .then((response) => {
      return response.text();
    })
    .then((state) => {
      const parsedState = JSON.parse(state);
      //console.log(parsedState);

      this.renderCart();
      
      this.updateLiveRegions(line, parsedState.item_count);
      const lineItem =  document.getElementById(`CartItem-${line}`);
      if (lineItem && lineItem.querySelector(`[name="${name}"]`)) lineItem.querySelector(`[name="${name}"]`).focus();
      this.disableLoading();
      
    }).catch((e) => {
      this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
      document.getElementById('cart-errors').textContent = window.cartStrings.error;
      this.disableLoading();
  	});
  }
  
  updateLiveRegions(line, itemCount) {
    this.enableLoading(line);
    if (this.currentItemCount === itemCount) {
      document.getElementById(`Line-item-error-${line}`)
      .querySelector('.cart-item__error-text')
      .innerHTML = window.cartStrings.quantityError.replace(
        '[quantity]',
        document.getElementById(`Quantity-${line}`).value
      );
    }
    this.currentItemCount = itemCount;
  }
  
  enableLoading(line) {
    document.getElementById('CartContainer').classList.add('cart__items--disabled');
    this.querySelectorAll(`#CartItem-${line} .loading-overlay`).forEach((overlay) => overlay.classList.remove('hidden'));
    document.activeElement.blur();
  }

  disableLoading() {
    document.getElementById('CartContainer').classList.remove('cart__items--disabled');
  }

}

customElements.define('cart-drawer-items', CartDrawerItem);

$(document).on('click','.scDiscount__container form .sc_simple-container .sc_code-btn:not(.clicked)',function(){
  var _this = $(this);
  $(_this).addClass('clicked');
  $(this).find('input[type="button"]').trigger('click');
  setTimeout(function(){
    document.querySelector('cart-drawer').drawerHeight();	
    $(_this).removeClass('clicked');        
  },3000);
  dCartDsicount(_this, 1);
});

function dCartDsicount(_this, _setTime = 3000){
  $('.ajaxcart__footer.discountApplyed').removeClass('discountApplyed');
  setTimeout(function(){
    var _nextElement = $(_this).closest('#scDiscountApp').find('.sc_simple-info');    
//     console.log('_nextElement',$(_this),_nextElement, $(_nextElement).children());
    if( $(_nextElement).length > 0 || $(_nextElement).children().length > 0){
      $('cart-drawer .cart-drawer-footer').addClass('discountApplyed');
      $(_this).closest('.cart-drawer-footer').find('.sc_simple-info .ajaxcart__total').remove();
      var discountContnt = $(_this).closest('.cart-drawer-footer').find('.sc_simple-info__row.sc_code-info');
      var subTotal = $(_this).closest('.cart-drawer-footer').find('.ajaxcart__SubtotalTemp');
      var addhtml = '<div class="ajaxcart__total"><span class="ajx-cart-label">Subtotal</span>'+$(subTotal).text().replace('Subtotal','')+'</div>';
      $( $(addhtml) ).insertBefore( $( discountContnt ) );
      $('body').removeAttr('data-dcartDsicount',0);
      document.querySelector('cart-drawer').drawerHeight();
//       $('.ajaxcart__SubtotalTemp').removeClass('hidden');
    }else{ 
      if( $('body[data-dcartDsicount]').length == 0 ){
        $('body').attr('data-dcartDsicount',0);
      }
      var _count = Number($('body').attr('data-dcartDsicount'));
      if( _count < 20 && $('.discountApplyed').length == 0 ){
        dCartDsicount(_this, 3000);
        _count = _count + 1;
        $('body').attr('data-dcartDsicount',_count);
      }
      //$('cart-drawer .cart-drawer-footer').removeClass('discountApplyed');
    }
  },_setTime);
}


function discountMutationObserver(){

  if( document.getElementById('scDiscountApp') == undefined ){
    if( $('body[data-discountMutationObserver]').length == 0 ){
      $('body').attr('data-discountMutationObserver',0);
    }
    var _count = Number($('body').attr('data-discountMutationObserver'));
    if( _count < 10 ){
      dCartDsicount(_this, 1000);
      _count = _count + 1;
      $('body').attr('discountMutationObserver',_count);
      setTimeout(function(){
        discountMutationObserver();
      },1000);
    }else{  }
  }
  $('body').removeAttr('discountMutationObserver',_count);


  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var targetNode = document.querySelector('.cart-drawer-footer .scDiscount__container #scDiscountApp');

  var observer = new MutationObserver(function(mutations, observer) {
    $('.ajaxcart__footer.discountApplyed').removeClass('discountApplyed');
    if($('#scDiscountApp').find('.sc_simple-info').length > 0){
      $('.ajaxcart__footer.discountApplyed').addClass('discountApplyed');
      $('.ajaxcart__footer.discountApplyed').addClass('disApplied');
      dCartDsicount($('.cart-drawer-footer .scDiscount__container form .sc_simple-container .sc_code-btn'));
    }
    document.querySelector('cart-drawer').drawerHeight();
  });

  observer.observe(targetNode, {
    subtree: true,
    attributes: true
  });
  return;
}



class CartDrawerNote extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', debounce((event) => {
      const body = JSON.stringify({ note: event.target.value });
      fetch(`${routes.cart_update_url}`, {...fetchConfig(), ...{ body }})
      .then((res) =>{
        if(res.ok && event.target.value !== ''){
          document.querySelector('.Cart__NoteButton').textContent = 'Edit Order Note';
        }else{
          document.querySelector('.Cart__NoteButton').textContent = 'Add Order Note';
        }
      });
    }, 350))
  }
}

customElements.define('cart-drawer-note', CartDrawerNote);

