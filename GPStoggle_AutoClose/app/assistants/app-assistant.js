function AppAssistant() {
}

AppAssistant.prototype.handleLaunch = function(launchParams) {
	if (launchParams.source != "note") {
		new Mojo.Service.Request('palm://com.palm.location', {
			method: 'getLocationServicePrefs',
			onSuccess: function(data){
				if (data.useGps) {
					new Mojo.Service.Request('palm://com.palm.location', {
						method: 'setUseGps',
						parameters: {
							useGps: false
						},
					});
				} else if (!data.useGps) {
					new Mojo.Service.Request('palm://com.palm.location', {
						method: 'setUseGps',
						parameters: {
							useGps: true
						},
					});
				}
			}
		});
		
		new Mojo.Service.Request('palm://com.palm.location', {
			method: 'getLocationServicePrefs',
			onSuccess: function(data){
				if (!data.useGps) {
					new Mojo.Service.Request('palm://com.palm.vibrate', {
						method: 'vibrate',
						parameters: {
							period: 1,
							duration: 150
						}
					});
					Mojo.Controller.getAppController().showBanner("GPS is on.", {
						source: 'note'
					});
				}
				else 
					if (data.useGps) {
						new Mojo.Service.Request('palm://com.palm.vibrate', {
							method: 'vibrate',
							parameters: {
								period: 1,
								duration: 150
							}
						});
						Mojo.Controller.getAppController().showBanner("GPS is off.", {
							source: 'note'
						});
											}
				Mojo.Controller.getAppController().closeAllStages()	
			}
		});
				var mainStageArgs = {name: 'mainStage', lightweight: true};
		var stageController = this.controller.getStageController('mainStage');
		var pushMain = function(stageController){
			stageController.pushScene('main');
		};
		this.controller.createStageWithCallback(mainStageArgs, pushMain, "card");
	}
	
}
