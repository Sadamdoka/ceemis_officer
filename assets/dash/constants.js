/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


    function isJsonArray(ob) {
        return ob.constructor === Array;
    }

    function jsonHas(str){
        return json_object.hasOwnProperty(str);
    }

    function isArray2(jobj) {
        var strdata = JSON.stringify(jobj);
        var starts = strdata.substr(0, 1);
        alert(starts+"/"+strdata);
        return starts === "[" ? true : false;
    }


    function isEmpty(str){
        return str == "" || str == null || str == "undefined";
    }

    function ShowError(title, message, callback){
        //alert(message);
        Dialog(title, message, "Try again", "red", callback);
        console.log(message);
    }
    function ShowSuccess(title, message, callback){
        //alert(message);
        Dialog(title, message, "Proceed", "green", callback);
    }

    function Dialog(Mytitle, Mymessage, Mybutton, Mytype, callb){

        var callback = !isEmpty(callb) ? callb : function(){};
        $.confirm({
            title: Mytitle,
            content: Mymessage,
            type: Mytype,
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: Mybutton,
                    btnClass: 'btn-'+Mytype,
                    action: callback
                },
                close: function () {
                }
            }
        });
    }

    function SubmitData(urlPath, formData, callb){
        SubmitFormData(urlPath, 'POST', formData, callb)
    }
    
    function SubmitGetData(urlPath, formData, callb){
        SubmitFormData(urlPath, 'GET', formData, callb)
    }


