/*
Setup:      Multi select of Last, First users called APPROVALS_REQUIRED
            and/or, linking picklist: APPROVAL_LISTS
            Three Workflow Transitions - Loop Back "Approve", "Reject" to
            Previous state and finally "Final Approval" to next state.
            This works in conjuction with two other scripts
Purpose:    This script will allow only allow the approvers to perform
            this transition.  With the exception of the last person in the
            list to approve - they will be the final approver.
Method:     Determine if the user has approved the item since last submit
            for approval.  If they're the last in the list to approve, block
            this transition in favor of the "Final Approval" transition.
Result:     When workflow is performed, the user will no longer have the action
            in their worklist unless the item is rejected, resubmitted
*/

//condition return value
var userCanApprove = false;


//start by getting the first and last name of the usr and check with the multi-select
var usr = Security.loadUser(userID);
var usrName = usr.lastName + ", " + usr.firstName;

var wfSteps = item.workflowActions;


//generate a list of approvers from APPROVAL_LISTS and APPROVALS_REQUIRED
var approvers =  getApprovers();


//main program starts here
if (approvers.length > 1){ //more than one approver is needed
    if (inArray(approvers,usrName) === true){ //current user is in list of approvers
		if (userAlreadyApproved(wfSteps,userID) === false){  //current user hasn't already approved
			if (requiresMoreApprovals(wfSteps, approvers.length,false) === true){ //still needs more approvals
                userCanApprove = true;  //ok for the current user to approve
            }
        }
    }
}


returnValue(userCanApprove);