enyo.kind({
  name: "simplepse.Preferences",
  kind: enyo.VFlexBox,
  events: { 
      onBack: "",
	  onSave:"",
	  onGotPrefs:""
  },
  components: [
		{kind: "ApplicationEvents", onBack: "cancelClick"},	
		{
          name: "getPreferencesCall",
          kind: "PalmService",
          service: "palm://com.palm.systemservice/",
          method: "getPreferences",
          onSuccess: "getPreferencesSuccess",
          onFailure: "getPreferencesFailure"
      },
      {
          name: "setPreferencesCall",
          kind: "PalmService",
          service: "palm://com.palm.systemservice/",
          method: "setPreferences",
          onSuccess: "setPreferencesSuccess",
          onFailure: "setPreferencesFailure"
      },
     	{kind: "PageHeader", kindLayout:"HFlexLayout", name: "header", style: "background: #ff6400", components:
			[
				{name: "HeaderLabel",style: "font-size:16pt", content: "Preferences" , flex:1},
			]},
		{kind: "Scroller", flex: 1, components: 
		[
		{kind: "RowGroup", caption: "On Startup", style: "margin:10pt", components: 
		[
			{kind: "HFlexBox", components: 
			[
				{content: "show",flex:1},
				{name: "StartShow", kind: "RadioGroup",style:"width:60%", onChange: "radioButtonSelected", components: 
				[
				  {label: "element", value: "element"},
				  {label: "hint", value: "hint"}
				]},
			]},
			{kind: "HFlexBox", name:"elementSelector",  components: 
			[
				{content: "element",flex:1},
				{name: "ElementShow", kind: "RadioGroup", style: "width:60%", onChange: "radioButtonSelected", components: 
				[
				  {name: "elementShowLast", label: "last", value: "last"},
				  {name: "elementShowRandom", label: "random", value: "random"},
				]},
				
			]},
			
		]},
		{kind: "RowGroup", caption: "Show Element Selector", style: "margin:10pt", components: 
		[
			{kind: "HFlexBox", components: 
			[
				{name: "ElementSelector", kind: "RadioGroup",flex:1, onChange: "radioButtonSelected", components: 
				[
				  {label:  "Z", value: "Z"},
				  {label: "name",value: "Name"},
				  {label: "both",value: "Both"},
				]},
			]},
		]},
		{kind: "HFlexBox", pack: "end", style: "padding: 0 10px;",
                  components: [
                      {name: "saveButton", kind: "Button",
                          content: "Save", onclick: "saveClick"},
                      {width: "10px"},
                      {name: "cancelButton", kind: "Button",
                          content: "Cancel", onclick: "cancelClick"}
                  ]
        },
		]},
  ],
	create: function() 
	{
		  this.inherited(arguments);
		  this.$.getPreferencesCall.call(
		  {
			  "keys": ["StartShow", "ElementShow","LastElement","ElementSelector"]
		  });
		  this.savedStartShow = "";
		  this.savedElementShow = "";
		  this.savedLastElement = "";
		  this.savedElementSelector = "";
	},
	
	radioButtonSelected: function()
	{
		if (this.$.StartShow.getValue() == "hint")
		{
			this.$.elementShowRandom.setDisabled(true);
			this.$.elementShowLast.setDisabled(true);
		}
		else
		{
			this.$.elementShowRandom.setDisabled(false);
			this.$.elementShowLast.setDisabled(false);
		
		}
	},
	
	getPreferencesSuccess: function(inSender, inResponse) {
		
		this.savedStartShow = inResponse.StartShow; //variable set
		this.savedElementShow = inResponse.ElementShow;
		this.savedLastElement = inResponse.LastElement;
		this.savedElementSelector = inResponse.ElementSelector;
		this.$.StartShow.setValue(this.savedStartShow);
		if (!this.savedStartShow)
		{
			this.savedStartShow="default";
			this.savedElementShow="random";
			this.savedElementSelector = "Both";
			this.$.StartShow.setValue("hint");
		}
		this.$.ElementShow.setValue(this.savedElementShow); //radiogroup set
		this.$.ElementShow.doChange();
		this.$.ElementSelector.setValue(this.savedElementSelector);
		this.doGotPrefs(this.savedStartShow,this.savedElementShow,this.savedLastElement,this.savedElementSelector); //send parameter to main view
	  },
	  
	saveClick: function(inSender, inEvent) {
		var newStartShow = this.$.StartShow.getValue();
		var newElementShow = this.$.ElementShow.getValue();
		var newElementSelector = this.$.ElementSelector.getValue();
		this.$.setPreferencesCall.call(
		{
			  "StartShow": newStartShow,
			  "ElementShow": newElementShow,
			  "ElementSelector": newElementSelector,
		});
		this.doSave(newElementSelector);
	},
	getPreferencesFailure: function(inSender, inResponse) 
	{
		  enyo.log("got failure from getPreferences");
	},
	setPreferencesSuccess: function(inSender, inResponse) {
		  enyo.log("got success from setPreferences");
	},
	setPreferencesFailure: function(inSender, inResponse) {
		  enyo.log("got failure from setPreferences");
	  },
  
	cancelClick: function(inSender,inEvent)
	{
		this.doBack(inEvent);
	},
});
