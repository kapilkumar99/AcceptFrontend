window.onload=loadpage();

function loadpage()
{
  var pageurl=window.location.href;

  if(pageurl.toLowerCase().indexOf("producttype")>0)
  {
    if(pageurl.toLowerCase().indexOf("acceptjs")>0)
    {
        document.getElementById("acceptjs").style.display="block";
        //Show card information by default
        document.getElementById("rdCard").click();
    }
    else if(pageurl.toLowerCase().indexOf("acceptui")>0)
    {
      AcceptUI();
    }
    else if(pageurl.toLowerCase().indexOf("accepthosted")>0)
    {
      /* if(pageurl.toLowerCase().indexOf("customerid")>0)
       {
         var id = getParameterByName('customerid',window.location.href);
         
       }
       validateID(id);
         AcceptHosted();*/
    }
    else if(pageurl.toLowerCase().indexOf("acceptcustomer")>0)
    {
      //AcceptCustomer();
    }
  }
}

function AcceptUI()
{
     document.getElementById("acceptui").style.display="block";
    
     var ele=document.getElementById("btnAcceptUI");
     ele.click();
     
      setTimeout(function(){ 
             var d = document.getElementById("AcceptUIContainer");
              d.className += "show";
       },200);
     
}

//On click of radio buttons
function showData(option)
{
     if(option=="card")
     {
        document.getElementById("bank").style.display="none";
        document.getElementById("card").style.display = "block";
     }
    else{
     document.getElementById("card").style.display = "none";
     document.getElementById("bank").style.display = "block";
    }
  document.getElementById("btns").style.display = "block";
}

//To validate fields in Accept JS form
function validatePaymentFields()
{
  var sel=document.querySelector('input[name="optradio"]:checked').value;
  if(sel=="card")
  {
   var cardNo = document.getElementById("cardNumber");
   var expMonth = document.getElementById("expMonth");
   var expYear = document.getElementById("expYear");

       if(cardNo.value=="") 
         cardNo.classList.add("error");
       else
       {
         cardNo.classList.remove("error");
         cardNo.classList.add("success");
       }
       if(expMonth.value=="")  
         expMonth.classList.add("error");
       else
       {
         expMonth.classList.remove("error");
         expMonth.classList.add("success");
       }
       if(expYear.value=="")  
         expYear.classList.add("error");
       else
       {
          expYear.classList.remove("error");
          expYear.classList.add("success");
       }
   }
   else{
     var accountNumber = document.getElementById("accountNumber");
     var routingNumber = document.getElementById("routingNumber");
     var nameOnAccount = document.getElementById("nameOnAccount");
     var accountType = document.getElementById("accountType");

        if(accountNumber.value=="")  
          accountNumber.classList.add("error");
       else
       {
         accountNumber.classList.remove("error");
         accountNumber.classList.add("success");
       }
       if(routingNumber.value=="")
         routingNumber.classList.add("error");
       else
       {
        routingNumber.classList.remove("error");
         routingNumber.classList.add("success");
       }
       if(nameOnAccount.value=="")
         nameOnAccount.classList.add("error");
       else
       {
          nameOnAccount.classList.remove("error");
          nameOnAccount.classList.add("success");
       }
        if(accountType.value=="")  
         accountType.classList.add("error");
        else
        {
          accountType.classList.remove("error");
          accountType.classList.add("success");
        }
   }
   var iserror=document.getElementsByClassName("error");
   if(iserror.length>0)
   {
    return "false";
   }
   else
   {
    return "true";
   }
}

//Send payment information on Pay click in Accept Js
function sendPaymentDataToAnet()
{

   var isvalid=validatePaymentFields();
  if(isvalid=="true")
  {
   var authData = {};
   authData.clientKey = "8RkzpvcF4mbCAm8fCzD537VuT6X5ZXaXT833awgXg7z8P99e2MXwXMzRE2v2NA3b";//"58Ur68c2tnE452gbmhWX4AT5Lpc9wQGCG5CcR39nZRU6NJmh2W7BzvqSRz3rJV5k";//"8s2F95Q7brhHd7Tns";
   authData.apiLoginID = "42a6v35CanG9";//"244dkNUJcH";//"78BZ5Xprry";

    var sel=document.querySelector('input[name="optradio"]:checked').value;
    
    if(sel=="card")
    {
        var cardData={};
        cardData.cardNumber = document.getElementById("cardNumber").value;
        cardData.month = document.getElementById("expMonth").value;
        cardData.year = document.getElementById("expYear").value;
        cardData.cardCode = document.getElementById("cardCode").value;
    }
    else
    {
       var bankData={};
       bankData.accountNumber = document.getElementById('accountNumber').value;
       bankData.routingNumber = document.getElementById('routingNumber').value;
       bankData.nameOnAccount = document.getElementById('nameOnAccount').value;
       bankData.accountType = document.getElementById('accountType').value;
   }
   var secureData = {};
   secureData.authData = authData;
   if(sel=="card")
    secureData.cardData = cardData;
   else
   secureData.bankData = bankData;

   Accept.dispatchData(secureData, responseHandler);
 }
}

function responseHandler(response) {
    if (response.messages.resultCode === "Error") {
        var i = 0;
        while (i < response.messages.message.length) {
            console.log(
                response.messages.message[i].code + ": " +
                response.messages.message[i].text
                );
            i = i + 1;
        }
    } else {
        paymentFormUpdate(response.opaqueData);
    }
}

//Reset fields on submit
function paymentFormUpdate(opaqueData) {
    document.getElementById("dataDescriptor").value = opaqueData.dataDescriptor;
    document.getElementById("dataValue").value = opaqueData.dataValue;

    // If using your own form to collect the sensitive data from the customer,
    // blank out the fields before submitting them to your server.
    document.getElementById("cardNumber").value = "";
    document.getElementById("expMonth").value = "";
    document.getElementById("expYear").value = "";
    document.getElementById("cardCode").value = "";
    document.getElementById("accountNumber").value = "";
    document.getElementById("routingNumber").value = "";
    document.getElementById("nameOnAccount").value = "";
    document.getElementById("accountType").value = "";
    var element=document.getElementsByClassName('error');
    while (element.length)
    element[0].classList.remove("error");
    
    element=document.getElementsByClassName('success');
    while (element.length)
    element[0].classList.remove("success");
    
    document.getElementById("alert").style.display = "none";

   var tokenVal=document.getElementById("dataValue").value;

   // Ajax call for API
   $.ajax({
    type: 'GET',  
    url:'https://10.173.198.59:2018/api/AcceptSuite/AcceptJS',
    data: {
      token: tokenVal
    },
    contentType: "application/json; charset=utf-8",
    success: function (data, textStatus, jqXHR) {
            document.getElementById("msg").innerHTML =data;
            var element = document.getElementById("alert");
            element.classList.remove("alert-danger");
            element.classList.add("alert-success");
            document.getElementById("alert").style.display="block";
        },
        error: function (jqXHR, textStatus, errorThrown) {
          document.getElementById("msg").innerHTML =textStatus;
          var element = document.getElementById("alert");
          element.classList.remove("alert-success");
          element.classList.add("alert-danger");
          document.getElementById("alert").style.display="block";
        }
  });
}