'use strict';

// DEFINE "CLASSES"

function AddressBook(){
  this.knownKeys = [ 'firstName', 'lastName', 'street', 'city', 'state', 'phoneNumber' ];
  this.addresses = [];
}

AddressBook.prototype = {

  /**
   * METHOD: addContact
   * @contact - Object
   * Adds a contact object to the `addresses` prop on instance
   */
  addContact: function(contact){
    contact.id = this.createNextId();
    this.addresses.push(contact);
  },
  
  /**
   * METHOD: fetchContact
   * @id - integer
   * RETURNS - Object - contact from `addresses` prop
   */
  fetchContact: function(id){
    return this.addresses.find(function(contact){
      return contact.id === id;
    });    
  },
  
  /**
   * PRIVATE METHOD: createNextId
   * Determines next available `id` for new contact object
   */
  createNextId: function(){
    if (this.addresses.length == 0) return 1;
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

  /**
   * METHOD: collectFormData
   * Iterates all user input fields
   * RETURNS - Object - contact object 
   */
  collectFormData: function(){
    var o = {};
    
    this.inputFieldIds.forEach(function(el){
      o[el] = $('#' + el).val();
    });

    return o;
  },

  /**
   * METHOD: clearFormData
   * resets all input fields in form
   */
  clearFormData: function(){
    this.inputFieldIds.forEach(function(el){
      $('#' + el).val('');
    });  
  },
  
  /**
   * METHOD: validateFormData
   * @contact - object
   * checks object passed in for all required fields
   * RETURNS - boolean
   */
  validateFormData: function(contact){
    if ( !contact.firstName || !contact.lastName ) return false;
    return true;
  }
  
};

function View(addressBook){
  this.addressBook = addressBook
}

View.prototype = {
  prettifyFieldName(name){
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function(str){ return str.toUpperCase(); });
  },

  renderContacts: function(){
    $('.contacts-list ul').empty();
    
    this.addressBook.addresses.forEach(function(contact){
      $('.contacts-list ul').append(`<li><a href='#' class='show-contact' id='${contact.id}-show-contact'>${contact.firstName}</a></li>`);
    });
  },

  createDetailHtml: function(contact){
    var html = '';
    this.addressBook.knownKeys.forEach(function(keyName){
      if (contact[keyName]) html += `<strong>${view.prettifyFieldName(keyName)}:</strong> ${contact[keyName]}<br />`;
    });
    return html;
  },

  renderDetail: function(contact){
    $('#contact-detail-info').html(this.createDetailHtml(contact));
  },

  sendFeedback: function(msg, fadeTime){
    fadeTime = fadeTime || 2000;
    $('.feedback p').text(msg).fadeIn(1000, function(){
      setTimeout(function(){
        $('.feedback p').fadeOut(1000);      
      }, fadeTime);
    });
  }

};

var addressBook = new AddressBook();
var addressForm = new AddressForm();
var view = new View(addressBook);

$(function(){
  
  $('button#add-contact').click(function(e){
    e.preventDefault();
    var contact = addressForm.collectFormData();
    
    // validation
    if ( addressForm.validateFormData(contact) ) {
      addressBook.addContact(contact);
      addressForm.clearFormData();
      view.renderContacts();
    } else {
      view.sendFeedback("You must enter a first and last name.");
    }
    
  });
  
  $('.contacts-list').on('click', '.show-contact', function(e){
    e.preventDefault();
    var contact = addressBook.fetchContact(parseInt(e.target.id));
    view.renderDetail(contact);
  });
  
});

