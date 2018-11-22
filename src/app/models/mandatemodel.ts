export class Mandate {
    product;

	/*
	 * Utility Code / Originator Identifier
	 */
    utilityCode;

	/*
	 * Sponsoring Bank Code
	 */
    sponsorBankCode;

	/*
	 * Payer bank code
	 */
    payerBankCode;

	/*
	 * Payer account Type
	 */
    payerAccType;

	/*
	 * Payer Account Number
	 */
    payerAccNum;

	/*
	 * Payer Name
	 */
    payerName;

	/*
	 * Connsumer Reference Number
	 */

    consumerRefNo;

	/*
	 * Scheme Reference Number
	 */
    schemeRefNo;

	/*
	 * Mandate Frequency
	 */
    mandateFrequency;

	/*
	 * Mandate start date
	 */
    startDate;

	/*
	 * Mandate expire date
	 */
    endDate;

	/*
	 * This flag will decide whether to keep mandate until cancelled by user
	 */
    untilCancel;

	/*
	 * Amount type to be collected either "VARIABLE" or "FIXED"
	 */
    amountType;

	/*
	 * Maximum amount to be collected
	 */
    maxAmount;

	/*
	 * Maximum amount to be collected
	 */
    minAmount;

	/*
	 * Payer Identification to be collected
	 */
    payerIdentification;

	/*
	 * Comments entered by authorizer at the time of authorization."
	 */
    authComment;

	/*
	 * Authorization level
	 */
    auhorisationLevel;

	/*
	 * Enable/Disable Auto Collection of amount
	 */
    autoCollectionFlag;

    batchRefNo;

	/*
	 * Mandate capture mode
	 */
    mndCaptureMode;

	/*
	 * Mandate Category
	 */
    mandateCategory;

	/*
	 * Charges plan Code
	 */
    chargesPlanCode;

	/*
	 * Communication Flag
	 */
    communicationFlag;

	/*
	 * Mandate Creation Date
	 */
    createdDate;

	/*
	 * name of user who created the Mandate
	 */
    createdBy;

	/*
	 * Image Reference Number
	 */
    docRefNo;

	/*
	 * Number Of Instances Allowed
	 */
    instancesAllowed;

	/*
	 * Defined days
	 */
    definedDays;

	/*
	 * Mandate File name
	 */
    fileName;

	/*
	 * Mandate Reason Code
	 */
    mandateReasonCode;

	/*
	 * Last authorizer name or modifier name
	 */
    lastModifiedBy;

	/*
	 * Date when last modified
	 */
    lastModifiedDate;

	/*
	 * Application generated mandate reference number
	 */
    mndRefNo;

	/*
	 * Old reference number
	 */
    oldRefNo;

	/*
	 * Originator Name
	 */
    originatorName;

	/*
	 * Sender Reference Number
	 */
    senderRefNo;

	/*
	 * payer email identifier
	 */
    payerEmail;

	/*
	 * Payer Contact Number
	 */
    payerContactNo;

	/*
	 * Payer Mobile Number
	 */
    payerMobileNo;

	/*
	 * Payer Identification number
	 */
    payerIdNo;

	/*
	 * Payer Identification Type
	 */
    payerIdType;

	/*
	 * Process status
	 */
    processStatus;

	/*
	 * Mandate Purpose Code
	 */
    mandatePurposeCode;

	/*
	 * Processing Queue Status
	 */
    queueStatus;

	/*
	 * Transaction Code
	 */
    transactionCode;

	/*
	 * Unique Mandate Reference number
	 */
    umrn;

	/*
	 * Aadhar number
	 */
    aadharNo;

	/*
	 * Re-Init Flag
	 */
    reInitFlag;

	/*
	 * Re-Init Count
	 */
    reInitCount;

	/*
	 * Mandate Type
	 */
    mandateType;

	/*
	 * Stop Pay Flag
	 */
    stopPayFlag;

	/*
	 * Stop Start Date
	 */
    stopStartDate;

	/*
	 * Stop End Date
	 */
    stopEndDate;

	/*
	 * Instd Agent
	 */
    instdAgt;

	/*
	 * Instd Agent
	 */
    instdAgtName;


    mndOutFlag;

    instancesPaid;

    channelId;

    messageId;

    accountStatus;

    defermentFlag;

	/*
     * attribute1 is used for reject reason ackResponseFile
     * */
    attribute1;

    attribute2;

	/*
     * attribute3 is used for reject reason finalResponseFile
     * */
    attribute3;

	/*
	 * attribute4 is used for bulkFileReferenceNumber
	 * */
    attribute4;

    attribute5;

    attribute6;

    attribute7;

    attribute8;

    attribute9;

    attribute10;

    attribute11;

    attribute12;

    attribute13;

    attribute14;

    attribute15;

    attribute16;

    attribute17;

    attribute18;

    attribute19;

    attribute20;

    documents;

    apiRefId;

    dueDay;

    payerMicrCode;

    apiStatus;

    payerBankName;


	/*
	 * Mandate source
	 */
    mndSource;

    startDateStr;

    acceptDate;

    rejectDate;

    imageRejected;

    reEnteredpayerBankCode;

    locked;

    userName;

    lockedTime;

    tenantId;

    entityId;

    accessLevel;

    amt;

    mndChannel;

	custAddId;
	
	reason;

	mndTxnCode;
}
