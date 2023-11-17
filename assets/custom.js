$(function () {
  
  // Ingredients&Nutrition popup product new template
  if ($(".product-main-new .moku-ingredients").length > 0) {
    $(document).on(
      "click",
      ".product-main-new .moku-ingredients",
      function (e) {
        e.preventDefault();
        $(".ingredients-modal-main").addClass("active");
      }
    );
  }
  //close popup
  $(document).on("click", ".ingredients-modal-main .close-icon", function (e) {
    e.preventDefault();
    $(".ingredients-modal-main").removeClass("active");
  });
  //close popup when click outside
  $("body").on("click", function (e) {
    if (
      $(e.target).is(".ingredients-modal-main.active") === true ||
      $(e.target).is(".ingredients-modal-new") === true
    ) {
      $(".ingredients-modal-main").removeClass("active");
    }
  });
  //END

  // Ingredients&Nutrition popup product varity-new template
  $(document).on("click", ".ingredients-modal-main .ingredients-tab-link", function (e) {
    e.preventDefault();
    var dataId = $(this).attr("data-title");
    var mainTabLink = $(".ingredients-modal-main .ingredients-tab-link");
    var mainContenDiv = $(".ingredients-modal-main  .ingredients-modal-body");
    for (var i = 0; i < mainTabLink.length; i++) {
      mainTabLink[i].classList.remove("active");
      mainContenDiv[i].style.display = "none";
    }
    $(this).addClass("active");
    $(".ingredients-modal-main #" + dataId + "").css("display", "block");
  });
  //END
  

  //START - For convert select tag to ul-li structure of retextion frequenct tab --PD page
  $(".Product__InfoWrapper #rtx_option_plans_dropdown").each(function () {
    
    var $this = $(this),
      numberOfOptions = $(this).children("option").length;

    $this.addClass("hidden");
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="styledSelect"></div>');

    var $styledSelect = $this.next("div.styledSelect");

    $styledSelect.text("Delivery " + $this.children("option").eq(0).text());

    var $list = $("<ul />", {
      class: "options",
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
      $("<li />", {
        text: "Delivery " + $this.children("option").eq(i).text(),
        rel: $this.children("option").eq(i).val(),
      }).appendTo($list);
    }

    var $listItems = $list.children("li");

    $styledSelect.click(function (e) {
      e.stopPropagation();
      if ($(this).hasClass("active")) {
        $(this).next("ul.options").hide();
      } else {
        $(this).next("ul.options").show();
      }

      $(this).toggleClass("active");
    });

    $listItems.click(function (e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass("active");
      $this.val($(this).attr("rel"));
      $('[name="selling_plan"]').attr("value", $(this).attr("rel"));
      $list.hide();
    });

    $(document).mouseup(function (e) {
      var container = $(".styledSelect");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(".styledSelect").removeClass("active");
        $list.hide();
      }
    });
  });

  $(".rtx_option_plans ul.options li").click(function (e) {
    e.stopPropagation();
    $('.stikey-add-to-cart-wrap .rtx_option_plans__wrap .sticky-sub-option-plans li[data-value="'+$(this).attr('rel')+'"]').trigger('click');
    $(this).prependTo(".rtx_option_plans ul.options");
  });
  //END - For convert select tag to ul-li structure of retextion frequenct tab --PD page
  
  
  
  //START -- Quick Buy Popup collection
  var btnCount = 0;
  $('.quick-add-btn .quick-add-link').each(function(){
    $(this).on('click',function(e){
      var scrollYPos = 0;
      btnCount++;
      scrollYPos += window.scrollY;
      e.preventDefault();
      $('.quick-add-btn').removeClass('open');
      $(this).parent().toggleClass('open');
      if(btnCount == 1){
        //console.log('Call chnageSelectToUl Func');
        chnageSelectToUl();
      }

      //on variant chnage
      $(this).closest('.quick-add-btn').find('.quick-popup').find('.HorizontalList').find('input').on('change',function(){        
        $(this).parents('.HorizontalList').find('input').removeClass('checked');
        $(this).addClass('checked');
        var varId = $(this).attr('data-varid'), isAvailable = $(this).attr('data-available');
        var oneTimeBagPrice = $(this).attr('data-priceperbagonetime') || null, subBagPrice = $(this).attr('data-priceperbagsubscription') || null;
        $(this).parents('.quick-popup').find('form').find('input[name="id"]').attr('value',varId);
        //console.log('id',varId, 'available',isAvailable,'oneTimeBagPrice--',oneTimeBagPrice, 'subBagPrice--',subBagPrice);
        //change bag per case price
        if(oneTimeBagPrice) $(this).parents('.quick-popup').find('.rtx_option_one_time .rtx_price_per_bag').text(oneTimeBagPrice+'/Bag');
        if(subBagPrice) $(this).parents('.quick-popup').find('.rtx_option_sub .rtx_price_per_bag').text(subBagPrice+'/Bag');
        //check if product available
        if(isAvailable == 'false'){
          $(this).parents('.quick-popup').find('form').find('.ProductForm__AddToCart').prop('disabled',true);
          $(this).parents('.quick-popup').find('form').find('.ProductForm__AddToCart span').text('Sold out');
        }else{
          $(this).parents('.quick-popup').find('form').find('.ProductForm__AddToCart').prop('disabled',false);
          $(this).parents('.quick-popup').find('form').find('.ProductForm__AddToCart span').text('Add to cart');
        }
        
        const checkedInput = $(this).parents('.quick-popup').find('[name="selling_plan_select"]:checked');
        if(checkedInput[0].value === "onetime") {
          $(this).parents('.quick-popup').find("#priceToBeChanged").find(".price-item.price-item--regular")[0].innerText = $(this).attr("data-priceForOneTimeSelected")
        }
        else {
          $(this).parents('.quick-popup').find("#priceToBeChanged").find(".price-item.price-item--regular")[0].innerText = $(this).attr("data-priceForSubSelected")
        }

      });

    });
  });
  
  //close popup when outside click
  $(document).on('click', function (event) {
    if (!$(event.target).closest('.quick-add-link, .quick-popup').length) {
      $('body .quick-add-btn').removeClass("open");
    }
  }); 

  //closes popup when scroll
  if($('.new-collection-product').length){
    scrollPosition(790);
  }

  //END -- Quick Buy Popup collection

  
  
  $(".product-section-new .flavor_switcher_new").on("click", function (e) {
    $(this).toggleClass("active");
  });
  
  $(".Product_Slideshow").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: ".Product__SlideshowNavScroller",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: true,
        },
      },
    ],
  });
  $(".Product__SlideshowNavScroller").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: ".Product_Slideshow",
    arrows: true,
    focusOnSelect: true,
  });
  
  $(".loop-scroll").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 4000,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false,
    centerMode: true,
    variableWidth: true,
  });
  
  if ($(window).width() <= 640) {
    $(".reviews-carousel").slick({
      infinite: false,
      dots: true,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
    });
  }
  
  $(document).on("click", ".exp-variety-new .exp-inside-col", function (e) {
    e.preventDefault();
    var id = $(this).attr("id");
    var tab = $(".exp-variety-new .exp-inside-col");
    var tabCont = $(".exp-variety-new .experience-new-list");
    for (var i = 0; i < tab.length; i++) {
      tab[i].classList.remove("active");
      tabCont[i].classList.remove("active");
    }
    $(this).addClass("active");
    $('.exp-variety-new .experience-new-list[id="' + id + '"]').addClass(
      "active"
    );
  });

  $(document).on("click", ".desktop_div .tablinks", function () {
    var store_id = $(this).attr("data-id");
    $(".desktop_div .reviews-tab .reviews-tab-tabcontent").css(
      "display",
      "none"
    );
    $(".desktop_div .reviews-tab .tablinks").removeClass("active");
    $(this).addClass("active");
    $(".desktop_div .reviews-tab #" + store_id).css("display", "block");
    $(".desktop_div .reviews-tab-slider").slick("refresh");
  });

  $(document).on("click", ".mobile_div .tablinks", function () {
    var store_id = $(this).attr("data-id");
    $(".mobile_div .reviews-tab .reviews-tab-tabcontent").css(
      "display",
      "none"
    );
    $(".mobile_div .reviews-tab .tablinks").removeClass("active");
    $(this).addClass("active");
    $(".mobile_div .reviews-tab #" + store_id).css("display", "block");
    $(".mobile_div .reviews-tab-slider").slick("refresh");
  });

  $(".swiper-wrapper").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    infinite: true,
  });
  
  
  //Start - product collapsible acodian
  $(".collapsible-content > a").on("click", function(e) {
    e.preventDefault();
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(this).siblings(".content").slideUp(300);
      $(this).siblings(".collapsible-content-inner").slideUp(200); // for nested inner div accordian
      $(".content-inner").slideUp(200); // for nested inner div accordian
    } else{
      $(".collapsible-content a").removeClass("active");
      $(this).addClass("active");
      $(".content").slideUp(300);
      $(".collapsible-content-inner").slideUp(200);  // for nested inner div accordian
      $(".content-inner").slideUp(200); // for nested inner div accordian
      $(this).siblings(".content").slideDown(300);
      $(this).siblings(".collapsible-content-inner").slideDown(200);  // for nested inner div accordian
    }
  });
  // for nested accordian
  $(".collapsible-content-inner > a").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(this).siblings(".content-inner").slideUp(300);
    } else{
      $(".collapsible-content-inner a").removeClass("active");
      $(this).addClass("active");
      $(".content-inner").slideUp(300);
      $(this).siblings(".content-inner").slideDown(300);
    }
  });
  //End - //product collapsible acodian
  
  //sticy add-to-cart
  if($('body.product-new-body').length && $('.stikey-add-to-cart').length){
    var aTCBtn = $('form[action="/cart/add"] .ProductForm__AddToCart').offset().top - 15;
    $(window).scroll(debounce(function(event) {
      var scrollTop = $(this).scrollTop();
      //console.log('scrollTop',scrollTop, aTCBtn);
      scrollTop >= aTCBtn ? $('.stikey-add-to-cart').addClass('open') : $('.stikey-add-to-cart').removeClass('open');
    },100));
  }
  //&& sticky-add-to-cart
  
  
  //on-click jump to review section
  $(document).on("click", ".write-review-btn", function (e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: $('#junip-reviews-new').offset().top-30
    }, 750);
  });
  //&&
  
});




function chnageSelectToUl(){
  $(".quick-popup #rtx_option_plans_dropdown").each(function () {
    var $this = $(this),
        numberOfOptions = $(this).children("option").length;

    $this.addClass("hidden");
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="styledSelect"></div>');

    var $styledSelect = $this.next("div.styledSelect");

    $styledSelect.text("Delivery " + $this.children("option").eq(0).text());

    var $list = $("<ul />", {
      class: "options",
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
      $("<li />", {
        text: "Delivery " + $this.children("option").eq(i).text(),
        rel: $this.children("option").eq(i).val(),
      }).appendTo($list);
    }

    var $listItems = $list.children("li");

    $styledSelect.click(function (e) {
      e.stopPropagation();
      if ($(this).hasClass("active")) {
        $(this).next("ul.options").hide();
      } else {
        $(this).next("ul.options").show();
      }

      $(this).toggleClass("active");
    });

    $listItems.click(function (e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass("active");
      $this.val($(this).attr("rel"));
      $(this).closest('form').find('[name="selling_plan"]').attr("value", $(this).attr("rel"));
      $list.hide();
    });

    $(document).mouseup(function (e) {
      var container = $(".styledSelect");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(".styledSelect").removeClass("active");
        $list.hide();
      }
    });
  });

  $(".quick-popup .rtx_option_plans ul.options li").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).prependTo($(this).parent());
  });
}

function scrollPosition(pos){
  $(window).scroll(function() {   
    var scrollPdCard = $(window).scrollTop();
    if (scrollPdCard >= pos) {
      $('body .quick-add-btn').removeClass("open");
    }
  });
}