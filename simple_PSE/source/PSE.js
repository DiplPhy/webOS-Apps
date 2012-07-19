enyo.kind({
	name: "simplepse.simplePSE",
	kind: enyo.VFlexBox,
	style:"background-color: #C6DCF0",
	components: 
	[
		{name: "getPSE", kind: "WebService",
			url: "data/PSE.json",
			onSuccess: "gotPSE",
			onFailure: "gotPSEFailure"
		},
		{
            name : "openPalmService",
            kind : "PalmService",
            service : "palm://com.palm.applicationManager",
            method : "open",
            onSuccess : "openEmailSuccess",
            onFailure : "openEmailFailure",
            subscribe : true
         },
		 {
          name: "setPreferencesCall",
          kind: "PalmService",
          service: "palm://com.palm.systemservice/",
          method: "setPreferences",
          onSuccess: "setPreferencesSuccess",
          onFailure: "setPreferencesFailure"
      },
	{kind: "Pane", transitionKind: "enyo.transitions.LeftRightFlyin", flex: 1, components: //
	[
		{name: "mainView", kind: "VFlexBox", flex: 1, components:
		[
			
			{kind: "PageHeader", kindLayout:"HFlexLayout", name: "header", style: "background: #ff6400", components:
			[
				{content: "Simple PSE", flex:1, style: "font-size:16pt", name: "headerLabel"},
				{kind: "Picker", label: "Z", name: "ZPicker",items: 
					["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109","110","111","112"],
				onChange: "ZPickerChange"},
			  
				{kind: "Picker",name: "namePicker", label: "Name", items: 
					["Actinium","Aluminum","Americium","Antimony","Argon","Arsenic","Astatine","Barium","Berkelium","Beryllium","Bismuth","Bohrium","Boron","Bromine","Cadmium","Calcium","Californium","Carbon","Cerium","Cesium","Chlorine","Chromium","Cobalt","Copernicium","Copper","Curium","Darmstadtium","Dubnium","Dysprosium","Einsteinium","Erbium","Europium","Fermium","Fluorine","Francium","Gadolinium","Gallium","Germanium","Gold","Hafnium","Hassium","Helium","Holmium","Hydrogen","Indium","Iodine","Iridium","Iron","Krypton","Lanthanum","Lawrencium","Lead","Lithium","Lutetium","Magnesium","Manganese","Meitnerium","Mendelevium","Mercury","Molybdenum","Neodymium","Neon","Neptunium","Nickel","Niobium","Nitrogen","Nobelium","Osmium","Oxygen","Palladium","Phosphorus","Platinum","Plutonium","Polonium","Potassium","Praseodymium","Promethium","Protactinium","Radium","Radon","Rhenium","Rhodium","Roentgenium","Rubidium","Ruthenium","Rutherfordium","Samarium","Scandium","Seaborgium","Selenium","Silicon","Silver","Sodium","Strontium","Sulfur","Tantalum","Technetium","Tellurium","Terbium","Thallium","Thorium","Thulium","Tin","Titanium","Tungsten","Ununhexium","Ununoctium","Ununpentium","Ununquadium","Ununseptium","Ununtrium","Uranium","Vanadium","Xenon","Ytterbium","Yttrium","Zinc","Zirconium"],
				onChange:"namePickerChange"},
			]},
			{name: "resulteHeader", kind: "HFlexBox", components: 
			[
				{name: "resultLabel", style:"color:#326799", flex:1, allowHtml:true, content: ""},
				{name: "symbolLabel", content: "  ", style:"text-align:right;font-size: 22pt;color:#006400", allowHtml:true}
				
			]},
			{kind: "Divider",caption: "Properties"},
			{kind: "Scroller", name: "resultScroller", flex: 1, components:[
				{kind: "Repeater", name: "repeatMe", onSetupRow: "listSetupRow" }
			]},
					
		]},//mainview end
		{name: "helpView", kind: "simplepse.Help", flex: 1, onBack: "showMain"}, //helpView end
		{name: "prefView", kind: "simplepse.Preferences", flex: 1, onBack: "showMain", onSave: "prefSaved", onGotPrefs: "gotPreferences"}, //prefView end		
	]}, //pane end
		{kind: "AppMenu", components:
			[
				{caption: "Preferences", onclick: "showPreferences"},
				{caption: "Help", onclick: "showHelp"},
			]},
	],
  
	create: function() 
	{
		this.inherited(arguments);
		PSE = this.$.getPSE.call(); //call json request to webService
		PSE = this.results; 
		maxIndex=0; //stop filling of the repeater
		startScreenShowing = true; //is ture until a element is selected first time
		propString = ""; 
		valueArray = "";
		this.$.symbolLabel.hide(); 
		this.$.divider.hide();
		this.$.pane.selectViewByName("mainView");
	},
	
	prefSaved: function (inSender,inElementSelector)
	{
		if (inElementSelector=="Both")
		{
			this.$.namePicker.show();
			this.$.ZPicker.show();
		};
		if (inElementSelector=="Z")
		{
			this.$.namePicker.hide();
			this.$.ZPicker.show();
		};
		if (inElementSelector=="Name")
		{
			this.$.namePicker.show();
			this.$.ZPicker.hide();
		};
		this.showMain()
	},
	
	gotPreferences: function(inSender,inStartShow,inElementShow,inLastElement,inElementSelector)
	{
		if (inStartShow=="default")
		{
			this.$.resultLabel.setContent('<b><div style="font-size: 16pt;color:#006400"> This is simple PSE...</div></b><br/>...a simple Periodic System of Elements app.<br/><br/>Please select your chemical element of interest by name or by the atomic number of the element at one of the selectors in the app header. Have a look in the help menu to get further information.');
		};
		
		if ((startScreenShowing) && (inStartShow=="element"))
		{
			if (inElementShow=="last") //show last Element
			{
				this.$.namePicker.setValue(inLastElement);
				this.namePickerChange();
			};
			if (inElementShow=="random") //show random element
			{
				var randomZ = Math.round((Math.random()*111)+1);
				this.$.ZPicker.setValue(randomZ);
				this.ZPickerChange();
			
			};
		};
		if ((startScreenShowing) && (inStartShow=="hint"))
		{
			this.$.resultLabel.setContent('<b><div style="font-size: 16pt;color:#006400"> This is simple PSE...</div></b><br/>...a simple Periodic System of Elements app.<br/><br/>Please select your chemical element of interest by name or by the atomic number of the element at one of the selectors in the app header. Have a look in the help menu to get further information.');
		};
		if (inElementSelector=="Both")
		{
			this.$.namePicker.show();
			this.$.ZPicker.show();
		};
		if (inElementSelector=="Z")
		{
			this.$.namePicker.hide();
			this.$.ZPicker.show();
		};
		if (inElementSelector=="Name")
		{
			this.$.namePicker.show();
			this.$.ZPicker.hide();
		}
		this.render();
	},
	
	menuOpen: function ()
	{
		this.$.appMenu.open();
	},
	
	showHelp: function()
	{
		this.$.pane.selectViewByName("helpView");
	},
	
	showMain: function(inSender, inEvent)
	{
		this.$.pane.back(inEvent);
		inEvent.stopPropagation();
		//inEvent.preventDefault();
       //return -1;
	},
	
	showPreferences: function(inSender, inEvent)
	{
		this.$.pane.selectViewByName("prefView");
	},
		
	listSetupRow: function(inSender, inIndex) 
	{
		if (inIndex < maxIndex) {
			return {kind: "Item", layoutKind: "HFlexLayout", onclick: "itemClick", components: [
				{content: propArray[inIndex], flex: 1, style: "text-align:left"},
				{content: valueArray[inIndex], flex: 1, style: "text-align:right"},
			]};
		}
	},
	
	itemClick: function(inSender, inEvent)
	{
		   var r = inSender.rowIndex;
		   if (r==17)
		   {
				this.$.openPalmService.call({ "target": "http://en.m.wikipedia.org/wiki/"+selectedElement});
		   }
	},
	
	ShowSelectedElement: function(inElement)
	{
		currentElement = PSE[inElement];
		propString=""; 
		valueArray=[];
		propArray = [];
		this.$.resultLabel.setStyle("font-size: 20pt;color:#006400");
		this.$.resultLabel.setContent('<b>'+inElement+'</b><div style="font-size: 12pt;color:#006400"> '+currentElement.electronic_configuration+'</div>'); //display elements name in bold
		this.$.symbolLabel.show();
		this.$.divider.show();
		this.$.symbolLabel.setContent(currentElement.symbol+'<sup>'+currentElement.atomic_number+'</sup>');
		this.prepareArrays();
		this.$.repeatMe.render(); //update list
		this.render();
		var newinElement=inElement
		this.$.setPreferencesCall.call(
		{
			  "LastElement": newinElement,
		});
	},
 
	ZPickerChange: function(inSender) 
	{
		startScreenShowing = false;
		var Z = this.$.ZPicker.getValue();
		for (var element in PSE) // check which element is selected 
		{ 
			if (PSE[element].atomic_number==Z)
			{
				selectedElement=element; //copy the json indexer to selectedElements
			}
		}
		this.$.namePicker.setValue(selectedElement);
		this.ShowSelectedElement(selectedElement)
	},
	
	namePickerChange: function()
	{
		startScreenShowing = false;
		var nameOfElement = this.$.namePicker.getValue();
		for (var element in PSE) // check which element is selected 
		{ 
			if (element==nameOfElement)
			{
				selectedElement=element; //copy the json indexer to selectedElements
			}
		}
		currentElement = PSE[selectedElement];
		this.$.ZPicker.setValue(currentElement.atomic_number);
		this.ShowSelectedElement(selectedElement)
		
	},
	
	prepareArrays: function()
	{
		var i=0;
		for (var properties in currentElement) //work through the json object and list subobjects name and value
		{
			
			switch (properties){
				case "atomic_number": 						propString="dontShow";break;
				case "atomic_weight": 						propString = "atomic weight [u]";break
				case "atomic_radius pm":			    	propString = "atomic radius [pm]";break
				case "ionic_radius pm": 					propString = "ionic radius [pm]";break
				case "covalent_radius pm": 					propString = "covalent radius [pm]";break
				case "density g/cm": 						propString = "density [g/cm<sup>3</sup>]";break
				case "melting_point K": 					propString = "melting point [K]";break
				case "boiling_point K": 					propString = "boiling point [K]";break
				case "atomic_volume cm3/mol": 				propString = "atomic volume [cm<sup>3</sup>/mol]";break
				case "specific_heat (@20&degC J/g mol)": 	propString = "specific heat (@ 20&degC) [J/(g&times;mol)]";break
				case "fusion_heat (kJ/mol)": 				propString = "fusion heat [kJ/mol]";break;
				case "evaporation_heat (kJ/mol)": 			propString = "evaporation heat [kJ/mol]";break;
				case "thermal_conductivity (@25&degC W/m K) ": propString = "thermal conductivity (@25&degC) [W/(m&times;K)]";break;
				case "pauling_negativity": 					propString = "pauling negativity";break;
				case "first_ionizing kJ/mol": 				propString = "first ionizing [kJ/mol]";break;
				case "oxidation_states": 					propString = "oxidation states"; break;
				case "electronic_configuration": 			propString="dontShow";break; 
				case "lattice_structure" : 					propString = "lattice structure";break;
				case "lattice_constant ang" : 				propString = "lattice constant [&#8491]";break;
				default: 									propString="dontShow";break;
			}
			if (propString!="dontShow") //dont show some of the properties because they are shown in the header
			{
				valueArray[i]=enyo.string.stripQuotes(enyo.json.stringify(currentElement[properties]));
				propArray[i] = propString;
				i++;
			}
		}//for
		
		// add wiki article as item
		propArray[i] = "Wikipedia article of ";
		valueArray[i] = selectedElement;
		i++
		maxIndex=i;
	},
 
 
	gotPSE: function (inSender, inResponse,inRequest) 
	{
		PSE = inResponse;
		this.results = inResponse;
		ElementArray = [];
		var i=0;
		for (var element in PSE) // check which element is selected 
		{ 
			ElementArray[i] = element;
			i++;
		};
		ElementArray.sort();
	},
	
	gotPSEFailure: function(inSender, inResponse, inRequest) 
	{
		this.$.resultLabel.setContent("No PSE data available, please restart the app. If this will not help you have to delete and reinstall the app.")
    },
	
});