/*
Setup:      Multi select of Last, First users called APPROVALS_REQUIRED
            and/or pick list APPROVAL_LISTS
            Three Workflow Transitions 
Purpose:    This script will allow only approvers to perform this transition.
Method:     Determine if the user has approved the item since last submit
            for approval.
Result:     When workflow is performed, the user will no longer have the action
            in their worklist
*/


var userCanApprove = false;

//start by getting the first and last name of the usr and check with the multi-select
var usr = Security.loadUser(userID);
var usrName = usr.lastName + ", " + usr.firstName;

var wfSteps = item.workflowActions;


//generate a list of approvers from APPROVAL_LISTS and APPROVALS_REQUIRED
var approvers = getApprovers();

//main program starts here

if (inArray(approvers,usrName) === true){ //current user is in list of approvers
    if (userAlreadyApproved(wfSteps,userID) === false){  //current user hasn't already approved
		userCanApprove = true;  //ok for the current user to approve
    }
}


returnValue(userCanApprove);