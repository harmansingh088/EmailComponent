({
     doInit : function(component, event, helper) {
        var that = this;
        var recordAction= component.get("c.getEmailAddress");
            recordAction.setParams({recordId:component.get('v.recordId')});
            recordAction.setCallback(this,function(response){
            if (response.getState() === "SUCCESS") {
                    var email = response.getReturnValue();
                    if(email){
                       component.set("v.email", email);
                    }
            }
            else if (response.getState() === 'ERROR') {
                    helper.errorHandling(component, event,response);
                 }
             });
             $A.enqueueAction(recordAction);
            var action= component.get("c.getAllEmailTemplates");
                action.setCallback(this,function(result){
                    if (result.getState() === "SUCCESS") {
                        var allTemplateList=result.getReturnValue();

                        component.set("v.allTemplateList",allTemplateList);
                        console.log(allTemplateList);

                        var allTemplateNameList = component.get("v.allTemplateNameList");
                        var allTemplateNameList = [{

                              value:'-',
                              label:'-Select-'

                          }];
                        for(var i in allTemplateList){
                            allTemplateNameList.push({
                                  value:allTemplateList[i].DeveloperName,
                                  label:allTemplateList[i].DeveloperName
                               });


                        }
                        component.set("v.allTemplateNameList",allTemplateNameList);

                        component.set("v.selectedTemplate",component.get("v.defaultTemplateDevName"));
                      helper.fetchBodyAndSubject(component);
                  }else if (result.getState() === 'ERROR') {
                           helper.errorHandling(result);
                    }
                });
            $A.enqueueAction(action);
    },
    sendMail: function(component, event, helper) {
            // when user click on Send button
            // First we get all 3 fields values
            var getEmail = component.get("v.email");
            var getSubject = component.get("v.subject");
            var getbody = component.get("v.body");
            // check if Email field is Empty or not contains @ so display a alert message
            // otherwise call call and pass the fields value to helper method
            if ($A.util.isEmpty(getEmail) || !getEmail.includes("@")) {
                alert('Please Enter valid Email Address');
            } else {
                helper.sendHelper(component, getEmail, getSubject, getbody);
            }
        },

    // when user click on the close buttton on message popup ,
    // hide the Message box by set the mailStatus attribute to false
    // and clear all values of input fields.
    closeMessage: function(component, event, helper) {
        component.set("v.mailStatus", false);
        component.set("v.email", null);
        component.set("v.subject", null);
        component.set("v.body", null);
    },
    dropdownChange : function(component, event, helper){
        helper.fetchBodyAndSubject(component,event);
    }
})
