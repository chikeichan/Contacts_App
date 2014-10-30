//app.js
$(document).ready(function(){
	//Contact Model
	var Contact = Backbone.Model.extend({
		default: {
			fullName			: '',
			phoneNumber		: '',
			streetAddress	: '',
			city					: '',
			state					: '',
			zipCode				: '',
			id						: ''
		}
	});
	var person = {
			fullName			: 'Joe Doe',
			phoneNumber		: '510-765-4321',
			streetAddress	: '123 4th Ave',
			city					: 'San Francisco',
			state					: 'CA',
			zipCode				: '94134'
		};

	//Contact Collection Model
	var ContactList = Backbone.Collection.extend({
		model: Contact,
		localStorage: new Backbone.LocalStorage('contacts-backbone'),
		comparator: 'fullName'
	});

	var contacts = new ContactList;
	
	contacts.on('add',function(item){
		var contactView = new ContactView({model:item});
		contactView.render();
		$('content').append(contactView.el);
		item.save();
	})


	//Contact View
	var ContactView = Backbone.View.extend({
		tagName: 'div',
		className: 'contactCard',
		events: {
			'dblclick'					: 'clear',
			'click #change'			: 'edit',
			'click #noEdit'			: 'done'
		},
		template: _.template(	"<p id='fullName'><%= fullName %></p>"+
													"<p id='phoneNumber'><%= phoneNumber %></p>"+
													"<p id='streetAddress'><%= streetAddress %></p>"+
													"<p id='city'><%= city %></p>"+
													"<p id='state'><%= state %></p>"+
													"<p id='zipCode'><%= zipCode %></p>"+
													'<div id="change">edit</div>'),
		editTemplate: _.template(	'<form class="editing">'+
															'<input type="text" name="fullName" value="<%= fullName %>">'+
															'<input type="text" name="phoneNumber" value="<%= phoneNumber %>">'+
															'<input type="text" name="streetAddress" value="<%= streetAddress %>">'+
															'<input type="text" name="city" value="<%= city %>">'+
															'<input type="text" name="state" value="<%= state %>">'+
															'<input type="text" name="zipCode" value="<%= zipCode %>">'+
															'<div id="noEdit">done</div>'+
															'</form>'),
		render: function(){
			var attributes = this.model.toJSON();
			this.$el.html(this.template(attributes));
		},
		clear: function(){
			this.model.destroy();
			$(this.$el).fadeOut('fast', function(){
				$(this).remove();
			});
		},
		edit: function(){
			var attributes = this.model.toJSON();
			this.$el.html(this.editTemplate(attributes));
		},
		done: function(){
			var contact = {
				fullName			: $('.editing>input[name="fullName"]').val(),
				phoneNumber		: $('.editing>input[name="phoneNumber"]').val(),
				streetAddress	: $('.editing>input[name="streetAddress"]').val(),
				city					: $('.editing>input[name="city"]').val(),
				state					: $('.editing>input[name="state"]').val(),
				zipCode				: $('.editing>input[name="zipCode"]').val()
			};
			console.log(contact);
			this.model.set(contact);
			this.model.save();
			var attributes = this.model.toJSON();
			$(this.el).html(this.template(attributes));
		}
	});



	//Contact Collection View
	var ContactsView = Backbone.View.extend({
		render: function(){
			this.collection.forEach(this.addOne,this);
		},
		addOne: function(contactItem){
			var contactView = new ContactView({model: contactItem});
			contactView.render()
			//console.log(contactView.el);
			this.$el.append(contactView.el);
		}
	});

	var contactsView = new ContactsView({collection: contacts});
	contactsView.render();

	//APP View
	var AppView = new (Backbone.View.extend({
		el: $('content'),
		initialize: function(){
			this.render();
			contacts.fetch();
		},
		render: function(){
			this.$el.append('<div id="create">CREATE</div>');
			this.$el.append(	'<form>'+
													'<p id="title">Full name</p><input type="text" name="fullName">'+
													'<p id="title">Phone Number</p><input type="text" name="phoneNumber">'+
													'<p id="title">Street Address</p><input type="text" name="streetAddress">'+
													'<p id="title">City</p><input type="text" name="city">'+
													'<p id="title">State</p><input type="text" name="state">'+
													'<p id="title">Zip Code</p><input type="text" name="zipCode">'+
													'<div id="submit">submit</div>'+
													'</form>');
			this.$el.append(contactsView.el);
		}, 
		events: {
			'click #create': 'showIt',
			'click #submit': 'submit'
		},
		showIt: function(){
			$('form').toggle();
		},
		submit: function(){
			var contact = {
				fullName			: $('input[name="fullName"]').val(),
				phoneNumber		: $('input[name="phoneNumber"]').val(),
				streetAddress	: $('input[name="streetAddress"]').val(),
				city					: $('input[name="city"]').val(),
				state					: $('input[name="state"]').val(),
				zipCode				: $('input[name="zipCode"]').val()
			};
			$('form')[0].reset();
			contacts.add(contact);
		}
	}));


});

