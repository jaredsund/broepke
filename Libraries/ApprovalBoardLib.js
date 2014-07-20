/*
functionality: Gets a list of unique approvers from the APPROVAL_LISTS
                Used in the approval board scripts
input  :    FIELDS:  APPROVALS_REQUIRED, APPROVAL_LISTS.APPROVALS_REQUIRED
return :    array - a list of unique approvers.
*/
function getApprovers()
{
    //generate a list of approvers from APPROVAL_LISTS and APPROVALS_REQUIRED
    var approvers = [];
    if(item.APPROVALS_REQUIRED !== null){
        approvers = item.APPROVALS_REQUIRED;
    }
    if(item.APPROVAL_LISTS !== null){
        approvers = approvers.concat(item.APPROVAL_LISTS.APPROVALS_REQUIRED);
    }
    approvers = getUnique(approvers);
    
    return approvers;

}



/*
functionality: count the number of approvals found before a reject is found
                if the number of approvals found is equal to one more approval
                no more approvals needed, move to final approval
input  :    wfSteps (array:item.workflowActions) -- the list of workflow actions for an item
            requiredLength (int) -- The number of approvers required
            matchValue (bool) -- Return to be true or false if the required length is matched
return :    bool -- the matchValue (true/false) if required length is matched
*/  
function requiresMoreApprovals(wfSteps, requiredLength, matchValue){

    //Transition names used in this code.  These transitions are required for this script to operate
    var REJECT_TRANS = "Reject";
    var FINALAPPROVAL_TRANS = "Final Approval";
    var APPROVE_TRANS  = "Approve";

    var approvalsCounter = 0;
    var transName = '';
    
    //loop through the wf steps (starts with the latest)
    for(var i=0; i < wfSteps.length; i++) {
        transName = wfSteps[i].transition.shortName;

        //count the number of Approve States, before a reject is found
        if (transName === REJECT_TRANS || transName === FINALAPPROVAL_TRANS){
            break;  //reject was found, stop counting
        }
        else if (transName === APPROVE_TRANS){
			approvalsCounter++;
		}  
    }//end for loop
     
	//test then number of approvals found against those needed
    if(approvalsCounter === requiredLength - 1){
        //the required length matched the number of transitions counted, return the match value
        return matchValue;
    }

    //returns the opposite of the matched value if the length is not matched
	return !matchValue; 
}



/*
functionality: Checks to see if the current user has already approved since the last rejection
input  :    wfSteps (array:item.workflowActions) -- the list of workflow actions for an item
            passedUserID(string) -- user login ID.  Example sysadmin for 
return :    bool -- True if the user already approved, false otherwise.  
*/ 
function userAlreadyApproved(wfSteps, passedUserID){

    //Transition names used in this code.  These transitions are required for this script to operate
    var REJECT_TRANS = "Reject";
    var FINALAPPROVAL_TRANS = "Final Approval";
    var APPROVE_TRANS  = "Approve";

    var transName = '';
	var foundUser =  false;
	
    for(var i=0; i<wfSteps.length; i++){
		transName = wfSteps[i].transition.shortName;
		
        //If a rejected state is found stop looking
        if (transName === REJECT_TRANS || transName === FINALAPPROVAL_TRANS){
			break; //reject found, stop looking
        }
        else if (wfSteps[i].userID === passedUserID && transName === APPROVE_TRANS){
				//an approve state was found by the current user
                foundUser = true;
				break; //approve state by current user found, stop looking
        }
    }//end for loop
	
	return foundUser;
}