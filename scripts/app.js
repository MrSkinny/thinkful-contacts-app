function AddressBook(){
  this.addresses = [];
}

AddressBook.prototype = {
  addContact: function(contact){
    this.addresses.push(contact);
  }
};

var addressBook = new AddressBook();

$(function(){
  
  $('button#add-contact').click(function(e){
    e.preventDefault();
    
  });
  
});

