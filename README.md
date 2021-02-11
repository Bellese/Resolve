# Resolve
A Node JS testing application to test DNS records against pre-defined expected results.  It can be useful to automate testing when changing NS or other DNS Records.
 
Resolve uses native Node JS APIs and has no dependencies.

## Installing
Make sure you have [Node JS](https://nodejs.org/en/download/) installed before you proceed.  Once installed, set your working directory to where you have cloned the repository.

Then run:
```shell script
npm install
```

## Configuration
There are sample test cases in `tests.sample.json`.  Rename this file to `tests.json` and configure to your needs.

Test cases will need to be configured as an Array of Objects.  The format for an individual object is:
```json
  {
    "type": "[RECORD TYPE]",
    "host": "[HOSTNAME]",
    "expected_value": [
      "[MULTIPLE]",
      "[STRING]",
      "[VALUES]",
      "[ALLOWED]"
    ],
    "hard_fail": true | false
  },
```

For example, to check Google's NS Records:
```json
  {
    "type": "NS",
    "host": "google.com",
    "expected_value": [
      "ns1.google.com",
      "ns2.google.com",
      "ns3.google.com",
      "ns4.google.com"
    ],
    "hard_fail": true
  },
```

The `hard_fail` value determines if a warning or an error is thrown for the test case.  We can be used to easily distinguish essential and non-essential records in the output.

Resolve supports the following types of DNS records:
- A
- AAAA
- CNAME
- CAA
- MX
- NAPTR
- NS
- PTR
- SOA
- SVR
- TXT

## Running the Application
After you have completed setup use `npm run start` to run the tests.