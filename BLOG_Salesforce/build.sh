# --- Copying to LWC.OSS and setting mode (chmod)
	# Which folder am I starting at?
	SFROOT=`pwd`
	echo "Current folder: $SFROOT"
	echo ""

	# Copy Resources
	echo "Copying to LWC OSS..."
	echo "-- Resources"
	folderTO="../BLOG_LWC/src/resources/ELTOROIT"
	folderFROM="./force-apps/deploy/main/default/staticresources/ELTOROIT/"
	mkdir -p $folderTO
	chmod -R 777 $folderTO
	rm -rf $folderTO
	cp -R $folderFROM $folderTO  
	chmod -R 555 $folderTO

	# Copy LWC
	echo "-- LWC"
	folderTO="../BLOG_LWC/src/modules/c"
	folderFROM="./force-apps/deploy/main/default/lwc/"
	mkdir -p $folderTO
	chmod -R 777 $folderTO
	rm -rf $folderTO
	cp -R $folderFROM $folderTO  
	
	# Update Apex calls
	echo "-- Update Apex imports in LWC"
	folderTO="../BLOG_LWC/src/modules/c"
	cd $folderTO
	# pwd
	# @AuraEnabled
	oldApex="@salesforce\/apex\/"
	newApex="@salesforceApex\/"
	find . -type f -name "*.js" | xargs sed -i "" "s#$oldApex#$newApex#g"
	# # Refresh Apex
	# oldApex="import { refreshApex } from [\"'\`]@salesforce/apex[\"'\`];"
	# newApex="import { refreshApex } from '@salesforce\/apex';"
	# find . -type f -name "*.js" | xargs sed -i "" "s#$oldApex#$newApex#"
	chmod -R 555 .
	echo ""

# --- Push To Salesforce
	cd "$SFROOT"
	echo "Pushing metadata to Salesforce scratch org..."
    sfdx force:source:push --json --forceoverwrite | tee etLogs/buildLog.json | jq
	date
	# cat etLogs/buildLog.json

# --- Build the LWC.OSS
	# # Before hiding it...
	# echo "Hit ENTER to continue"
	# read

	# # echo "Building the Webserver"
	# npm run @ELTOROIT_PROD
	# cd ../Salesforce