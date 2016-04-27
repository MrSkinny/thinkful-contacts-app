'use strict';

function AddressBook(){
  this.knownKeys = [ 'firstName', 'lastName', 'street', 'city', 'state', 'phoneNumber' ];
  
  this.addresses = [
    {
      id: 1,
      firstName: 'rich'
    },
    {
      id: 2,
      firstName: 'laura'
    }
  ];
}

AddressBook.prototype = {
  addContact: function(contact){
    contact.id = this.createNextId();
    this.addresses.push(contact);
  },
  
  fetchContact: function(id){
    return this.addresses.find(function(contact){
      return contact.id === id;
    });    
  },
  
  createNextId: function(){
    return(
      Math.max.apply(null, this.addresses.map(function(address){
        return address.id;
      })) + 1
    );
  }
};

function AddressForm(){
  this.inputFieldIds = [ 'firstName', 'lastName', 'street', 'city', 'state', 'phoneNumber' ];
}

AddressForm.prototype = {

  collectFormData: function(){
    var o = {};
    
    this.inputFieldIds.forEach(function(el){
      o[el] = $('#' + el).val();
    });

    return o;
  },

  clearFormData: function(){
    this.inputFieldIds.forEach(function(el){
      $('#' + el).val('');
    });  
  },
  
  validateFormData: function(contact){
    if ( !contact.firstName || !contact.lastName ) return false;
    return true;
  }
  
};

var addressBook = new AddressBook();
var addressForm = new AddressForm();


function renderContacts(addressBook){
  $('.contacts-list ul').empty();
  
  addressBook.addresses.forEach(function(contact){
    $('.contacts-list ul').append(`<li><a href='#' class='show-contact' id='${contact.id}-show-contact'>${contact.firstName}</a></li>`);
  });
}

function createDetailHtml(addressBook, contact){
  var html = '';
  addressBook.knownKeys.forEach(function(keyName){
    if (contact[keyName]) html += `${contact[keyName]}<br />`;
  });
  return html;
}

function renderDetail(addressBook, contact){
  $('#contact-detail-info').html(createDetailHtml(addressBook, contact));
}

function sendFeedback(msg, fadeTime){
  fadeTime = fadeTime || 2000;
  $('.feedback p').text(msg).fadeIn(1000, function(){
    setTimeout(function(){
      $('.feedback p').fadeOut(1000);      
    }, fadeTime);
  });
}

$(function(){
  
  $('button#add-contact').click(function(e){
    e.preventDefault();
    var contact = addressForm.collectFormData();
    
    // validation
    if ( addressForm.validateFormData(contact) ) {
      addressBook.addContact(contact);
      addressForm.clearFormData();
      renderContacts(addressBook);
    } else {
      sendFeedback("You must enter a first and last name.");
    }
    
  });
  
  $('.contacts-list').on('click', '.show-contact', function(e){
    e.preventDefault();
    var contact = addressBook.fetchContact(parseInt(e.target.id));
    renderDetail(addressBook, contact);
  });
  
});

