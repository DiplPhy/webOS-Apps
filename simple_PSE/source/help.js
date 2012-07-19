enyo.kind({
  name: "simplepse.Help",
  kind: enyo.VFlexBox,
  events: { 
      onBack: "",
      onSelect: ""
  },
   components: [
    {kind: "ApplicationEvents", onBack: "helpBack"},	
	{
            name : "openPalmService",
            kind : "PalmService",
            service : "palm://com.palm.applicationManager",
            method : "open",
            onSuccess : "openEmailSuccess",
            onFailure : "openEmailFailure",
            subscribe : true
         },
     	{kind: "PageHeader", kindLayout:"HFlexLayout", name: "header", style: "background: #ff6400", components:
			[
				{content: "Help/About",style: "font-size:16pt" , flex:1},
			]},
			{kind: "Scroller", flex: 1, components: 
			[
				{name: "title", content: "title", style: "font-size:18pt; margin-left:10pt"},
				{name: "version", content: "version", style: "font-size:12pt;margin-left:10pt"},
				{kind: "RowGroup", caption: "Support", style: "margin:10pt", components: 
				[
					{kind: "HFlexBox", components: 
					[
						{kind: "Image", src: "images/help/application-web.png"},
						{content: "Website Support", style: "margin-left:10pt", flex: 1, onclick:"openWebsiteClick"}
					]},
					{kind: "HFlexBox", components: 
					[
						{kind: "Image", src: "images/help/application_twitter.png"},
						{content: "Follow me on Twitter", style: "margin-left:10pt", flex: 1, onclick:"openTwitterClick"}
					]},
					{kind: "HFlexBox", components: 
					[
						{kind: "Image", src: "images/help/application-email.png"},
						{content: "Email Support", style: "margin-left:10pt", flex: 1, onclick:"openEmailClick"}
					]},
					
								
				]}, 
				
				{style: "font-size:12pt;margin:10pt;text-align:justify", content: '<b><div style="color:#006400"> This is simple PSE...</div></b><br/>...a simple Periodic System of Elements app. The app shows the properties of a selected chemical element.<br/><br/><b>Element Selection</b><br/><br/>Please select your chemical element of interest by name or by the atomic number of the element at one of the selectors in the app header. If you want only to use the name or the atomic number to select the element you can setup the shown element selectors in the preferences menu.<br/><br/><b>Start Screen</b><br/><br/>You can decide what simple PSE shows on startup. You can select to show this hint text or to show an elment. If you would like to see an chemical element on startup you have to select between the last shown element or a random element.<br/><br/><b>Provided Data</b><br/><br/>The data of the chemical elements is provided by www.pnathan.com in the elements.json file and was updated and adapted to the needs of this app.'},
			]},//rowgroup
  ],
  create: function()
  {
  		this.inherited(arguments);
		this.results = [];
		AppInfoJson = enyo.fetchAppInfo();
		
		if(enyo.isString(AppInfoJson))
			AppInfoJson = JSON.parse(AppInfoJson);  //webos 1.x compatibility

		this.$.version.setContent(AppInfoJson.version+" by "+AppInfoJson.vendor);
		this.$.title.setContent(AppInfoJson.title);
  },
  
	openEmailClick: function() 
		{        
			this.$.openPalmService.call({ "target": "mailto: diplphy@gmail.com"}); 
		},
	
	openTwitterClick: function()
	{
		this.$.openPalmService.call({ "target": "http://www.twitter.com/DiplPhy"});
	},

	
	openWebsiteClick: function()
	{
		this.$.openPalmService.call({ "target": "http://www.diplphy.de"});
	},
	
	
	helpBack: function(inSender, inEvent)
	{
		this.doBack(inEvent);
	},
	
});
