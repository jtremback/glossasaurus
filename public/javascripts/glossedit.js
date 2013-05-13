$(function ($, _, Backbone) {

  "use strict";

  var Defin, DefinList, Defins, DefinView, AppView, App;



  // Term Model
  // ----------
  // Our basic **Defin** model has `term` and `summary` attributes.
  Defin = Backbone.Model.extend({

    // MongoDB uses _id as default primary key
    idAttribute: "_id",

    // Default attributes for the todo item.
    defaults: function () {
      return {
        term: '',
        summary: ''
      };
    },

    // Ensure that each todo created has `term`.
    initialize: function () {
      if (!this.get('term')) {
        this.set({'term': this.defaults.term});
      }
    }
  });



  // Defin Collection
  // ---------------
  DefinList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Defin,

    // Returns the relative URL where the model's resource would be
    // located on the server. If your models are located somewhere else,
    // override this method with the correct logic. Generates URLs of the
    // form: "/[collection.url]/[id]", falling back to "/[urlRoot]/id" if
    // the model is not part of a collection.
    // Note that url may also be defined as a function.
    url: function () {
      return "/defin" + ((this.id) ? '/' + this.id : '');
    }
  });



  // Create our global collection of **Defins**.
  Defins = new DefinList();



  // Defin Item View
  // --------------
  // The DOM element for a definition...
  DefinView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single definition.
    template: _.template($('#defin-template').html()),

    // The DOM events specific to an item.
    events: {
      "click *" : "toggleDone"
    },

    // The DefinView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Defin** and a **DefinView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function () {
      this.model.bind('change', this.render, this);
    },

    // Takes the info from the model and renders it with the template,
    // then sticking it in the el, and returning it.
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });



  // The Application
  // ---------------
  // Our overall **AppView** is the top-level piece of UI.
  AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#glossapp"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
    },

    initialize: function () {
    },

    render: function () {
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function (defin) {
      var view = new DefinView({model: todo});
      $("#defin-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function () {
      Defins.each(this.addOne);
    }
  });

  // Finally, we kick things off by creating the **App**.
  App = new AppView();



}(jQuery, _, Backbone));
