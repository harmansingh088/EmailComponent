({
    sendHelper: function(component, getEmail, getSubject, getbody) {
        var that = this;
            // call the server side controller method
        var action = component.get("c.sendMailMethod");
        // set the 3 params to sendMailMethod method
        action.setParams({
            'mMail': getEmail,
            'mSubject': getSubject,
            'mbody': getbody,
            'recordId':component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // if state of server response is comes "SUCCESS",
                // display the success message box by set mailStatus attribute to true
                //component.set("v.mailStatus", true);
                that.showToast(component, event,'SUCCESS!','Email Sent');
                $A.get("e.force:closeQuickAction").fire();
            }else if (response.getState() === 'ERROR') {
                 that.errorHandling(component,event,response);
            }

        });
        $A.enqueueAction(action);
    },
    fetchBodyAndSubject:function(component,event){
        var that = this;
        var templateName = component.get("v.selectedTemplate");
        var allTemplateList = component.get("v.allTemplateList");
        for(var i in allTemplateList){
            if(allTemplateList[i].DeveloperName == templateName){

                var action= component.get("c.getHtmlBody");
                console.log('recordId--->',component.get('v.recordId'));
                    action.setParams({recordId:component.get('v.recordId'),templateId:allTemplateList[i].Id});
                    action.setCallback(this,function(result){
                        if (result.getState() === "SUCCESS") {
                             var res = result.getReturnValue();
                             console.log('res-->',res);
                             if(res.status == 301){
                                    that.showToast(component, event,'Error!',res.Subject);
                             }else{
                                  component.set("v.body",res.mailHtmlBody);
                                  component.set("v.subject",res.mailSubject);
                             }

                        }else if (result.getState() === 'ERROR') {
                                that.errorHandling(component,event,result);
                         }
                      });
                    $A.enqueueAction(action);


            }
        }
    },
    errorHandling:function(component,event,response){

        var that = this;
        let errors = response.getError();

        let message = 'Unknown error'; // Default error message
        // Retrieve the error message sent by the server
        if (errors && Array.isArray(errors) && errors.length > 0) {
            message = errors[0].message;

            var pageErrors = errors[0].pageErrors;

            if(pageErrors && Array.isArray(pageErrors) && pageErrors.length >0){
                if(pageErrors[0].statusCode == "DUPLICATE_VALUE"){
                    message = 'Duplicate Serial Number Found - please check the serial number';
                }else{
                    message = pageErrors[0].message;
                }
            }

            that.showToast(component, event,'Error!',message);
        }
    },
    showToast : function(component, event, msgTitle,msg) {
        var toastEvent = $A.get("e.force:showToast");
        if(msgTitle == 'Error!'){
             toastEvent.setParams({
                                            "title": msgTitle,
                                            "message": msg,
                                            "type":"error"
                                        });
        }else{
             toastEvent.setParams({
                                    "title": msgTitle,
                                    "message": msg
                                });
        }

        toastEvent.fire();
            }
})
