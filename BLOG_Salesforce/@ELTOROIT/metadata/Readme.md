# Instructions

-   Create a folder named "doFirst" inside "force-apps" and put the metadata there.
-   (temporarily) add this to sfdx-project.json file
    { "path": "force-apps/doFirst", "default": false },
-   Execute this:
    sfdx force:source:convert --outputdir @ELTOROIT/metadata/API --rootdir "force-apps/doFirst"
-   Now remove this from sfdx-project.json
    { "path": "force-apps/doFirst", "default": false },
-   Deploy with this...
    sfdx force:mdapi:deploy --deploydir @ELTOROIT/metadata/API --wait 30

# Test

```
./@ELTOROIT/scripts/shell/CreateOrg.sh mainCreateScratchOrg
./@ELTOROIT/scripts/shell/CreateOrg.sh mainOpenDeployPage
./@ELTOROIT/scripts/shell/CreateOrg.sh mainPrepareOrg
```
