# vbm

## Getting Started

### Manual Dependencies
Almost all dependnecies are listed in devDependencies.  However, still depends on
- Install now globally (`npm i -g now`).
- To deploy the server using Google Cloud, follow the steps in `https://cloud.google.com/appengine/docs/standard/nodejs/quickstart`.

### App Engine
To get started, goto [AppEngine Getting Started](https://console.cloud.google.com/appengine/start?project=mmb-staging&folder&organizationId) and follow the prompts

### Google OAuth
Following the instructions [here](http://www.passportjs.org/docs/google/):

1. Enable [Google+ API from the Console](https://console.developers.google.com/apis/api/plus.googleapis.com/overview?project=mmb-staging)
2. Once you have done the above, you should be able to turn on the [OAuth Conset screen](https://console.developers.google.com/apis/credentials/consent?project=mmb-staging)
3. Once you have done the above, you should be able to create [OAuth Credentials](https://console.developers.google.com/apis/credentials?project=mmb-staging)

Download and save these credentials for dev, prod, and staging.

## Secrets
### Secrets in Dev
Put all secrets in `env/secrets.json`, which is not checked into source control.

#### Dev Firestore Access
Goto the [Firebase Console](https://console.firebase.google.com/u/0/project/mmb-dev-cee81/settings/serviceaccounts/adminsdk) and generate a new key and place it in `packages/server/secrets/[...].json`.
Then make sure `env.js` has `GOOGLE_APPLICATION_CREDENTIALS` set to `./secrets/[...].json`.

### Secrets in Production
Configuration and secrets are currently added into `app.yaml` (not in git) from `app.tmpl.yaml` via gulp process (stored in git).

Alternative (not used): follow this [SO answer](https://stackoverflow.com/a/54055525/8930600), put all secrets in a special file that is not stored in source control.

## Markdown Library
We're using [Marked](https://www.npmjs.com/package/marked), which has more dependents, downloads, and is smaller than [Showdown](https://www.npmjs.com/package/showdown).  The documentation on how to run it in node is available [here](https://marked.js.org/#/USING_ADVANCED.md#options)

## Development
- [Log Viewer](https://console.cloud.google.com/logs/viewer?project=mmb-dev-cee81)
- [Console](https://console.cloud.google.com/home/dashboard?project=mmb-dev-cee81)
- [Firestore Data Viewer](https://console.cloud.google.com/firestore/data?project=mmb-dev-cee81)
- [Firestore Permission Rules](https://console.firebase.google.com/u/0/project/mmb-dev-cee81/database/firestore/rules)

## Staging
- [Log Viewer](https://console.cloud.google.com/logs/viewer?project=mmb-staging)
- [Console](https://console.cloud.google.com/home/dashboard?project=mmb-staging)
- [Firestore Data Viewer](https://console.cloud.google.com/firestore/data?project=mmb-staging)
- [Firestore Permission Rules](https://console.firebase.google.com/u/0/project/mmb-staging/database/firestore/rules)

## Production
- [Log Viewer](https://console.cloud.google.com/logs/viewer?project=mmb-prod)
- [Console](https://console.cloud.google.com/home/dashboard?project=mmb-prod)
- [Firestore Data Viewer](https://console.cloud.google.com/firestore/data?project=mmb-prod)
- [Firestore Permission Rules](https://console.firebase.google.com/u/0/project/mmb-prod/database/firestore/rules)

## Asthetics
- [MUI CSS Colors](https://www.muicss.com/docs/v1/getting-started/colors)
- [Gradient Codegen](https://cssgradient.io/)

# Elections Resources
## From Vote at Home Insitute
- [Vote by Mail in the Primary](https://www.voteathome.org/wp-content/uploads/2019/08/2020-Presidential-Primary-Guide-to-Mail-Ballot-Voting.pdf)
- [Vote by Mail in the General Election](https://www.voteathome.org/wp-content/uploads/2019/07/NVAHI-Guide-to-When_How-to-Apply-2020.pdf)
- [Ballot Ready COVID-19](https://docs.google.com/spreadsheets/d/1nCgI28asUZi4FVihJd4YbjfdSUC4K3SMEECsMpyaQQE/edit?ts=5e8fa7d8#gid=1917493118)


## Florida
- [Vote by Mail](https://dos.myflorida.com/elections/for-voters/voting/vote-by-mail/)
- [County Supervisors](https://dos.elections.myflorida.com/supervisors/)
- Some useful addresses:
  - 100 S Biscayne Blvd, Miami, FL 33131
  - 5443 Main St, Port Richey, FL 34652
  - 2000 W Commercial Blvd, Fort Lauderdale, FL 33309

## Michigan
- They seem to accept email applications [Election Official's Manual](https://www.michigan.gov/documents/sos/VI_Michigans_Absentee_Voting_Process_265992_7.pdf)
- "Michigan residents who live in unincorporated places register to vote with their township clerk": [MI SOS](https://www.michigan.gov/documents/sos/ED-106_Circulating_CityTwp_Nom_+_Qual_Pet_Forms_647901_7.pdf)
- There is a St. Joseph Township and City, both in Berrien County.  They share a zipcode (Wikipedia [Township](https://en.wikipedia.org/wiki/St._Joseph_Charter_Township,_Michigan), [City](https://en.wikipedia.org/wiki/St._Joseph,_Michigan))

## Georgia
- Contact info for county board of registrars offices [website](https://elections.sos.ga.gov/Elections/countyregistrars.do).

## Wisconsin
- Municipal Clerk Lookup [API](https://myvote.wi.gov/en-US/MyMunicipalClerk)
- Municipal Clerk List [PDF](https://elections.wi.gov/sites/elections.wi.gov/files/2020-03/WI%20Municipal%20Clerks%20no%20emails%20Updated%203-23-2020.pdf
- County Clerk List [PDF](https://elections.wi.gov/sites/elections.wi.gov/files/2020-03/WI%20County%20Clerks%20no%20emails%20Updated%203-23-2020.pdf)

# Issues with Geocoding
- Cannot find 135 SE Martin Luther King, Jr. Blvd. Stuart, FL 34994 (https://dos.elections.myflorida.com/supervisors/countyInfo.asp?county=MRT)

# Contributors
- [SimpleMaps.com](https://simplemaps.com/data/us-zips)
