/*
#**** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
# 
# The contents of this file are subject to the Mozilla Public License
# Version 1.1 (the "License"); you may not use this file except in
# compliance with the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
# 
# Software distributed under the License is distributed on an "AS IS"
# basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
# License for the specific language governing rights and limitations
# under the License.
# 
# The Original Code is MozGnowser code.
# 
# The Initial Developer of the Original Code is Jayakrishnan B Nair
# Portions created by the Initial Developer are Copyright (C) 2009-2010.
# All Rights Reserved.
# 
# Contributor(s):
#   Jayakrishnan B Nair <jayakrishnan.bk.nair@gmail.com>
#   Sai Srivatsan R Iyengar
#   Ridima Borkar
#   Foram Dalal
# 
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
# 
#**** END LICENSE BLOCK *****
*/

const nsISupports = Components.interfaces.nsISupports;

// You can change these if you like
const CLASS_ID = Components.ID("cbd389a4-b7c6-4e45-a937-e086fc3fa4c2");
const CLASS_NAME = "JSGnowMoz";
const CONTRACT_ID = "@gnowledge.org/jsgnowmoz;1";
const INTERFACE = Components.interfaces.JSGnowMoz;
var top;
var ALT=Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService)
// This is your constructor.
// You can do stuff here.
function JSGnowMoz() {
  // you can cheat and use this
  // while testing without
  // writing your own interface
    // this.wrappedJSObject = this;
   
}

// This is the implementation of your component.
JSGnowMoz.prototype = {
  // for nsISupports
  QueryInterface: function(aIID)
  {
    // add any other interfaces you support here
    if (!aIID.equals(INTERFACE) && !aIID.equals(nsISupports))
        throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  },
hello: function() {  
	//	alert("Hello World!");

	//ALT.alert(null,"withinjscmponent",top);
		top.Deo();
	return "yell";
    } ,
  initialise: function(x){
	top=x;
	
	
    },
  debug: function(msg){
	top.debug(msg);
    }

  

}

//=================================================
// Note: You probably don't want to edit anything
// below this unless you know what you're doing.
//
// Factory
var JSGnowMozFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    return (new JSGnowMoz()).QueryInterface(aIID);
  }
};

// Module
var JSGnowMozModule = {
  registerSelf: function(aCompMgr, aFileSpec, aLocation, aType)
  {
    aCompMgr = aCompMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME, CONTRACT_ID, aFileSpec, aLocation, aType);
  },

  unregisterSelf: function(aCompMgr, aLocation, aType)
  {
    aCompMgr = aCompMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);        
  },
  
  getClassObject: function(aCompMgr, aCID, aIID)
  {
    if (!aIID.equals(Components.interfaces.nsIFactory))
      throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

    if (aCID.equals(CLASS_ID))
      return JSGnowMozFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aCompMgr) { return true; }
};

//module initialization
function NSGetModule(aCompMgr, aFileSpec) { return JSGnowMozModule; }
