const dns = require('dns');
const GREEN  = '\033[0;32m';
const YELLOW = '\033[1;33m';
const RED    = '\033[0;31m';
const CLEAR  = '\033[0m';

function matchOutput(type, record, response) {
    let clean_response = response;
    if(type === "MX") {
        clean_response = [];
        for(let i = 0;i < response.length; i++) {
            clean_response.push(`${response[i].exchange} priority ${response[i].priority}`);
        }
    }
    let mismatch = findDifferences(record.expected_value, clean_response, (type === 'TXT'));
    if(mismatch.length === 0) {
        return `${GREEN}PASSED${CLEAR}\t${record.type}\t\t${record.host}`;
    } else {
        const warning_level = (record.hard_fail === true)? `${RED}FAILED${CLEAR}` : `${YELLOW}WARNING${CLEAR}`;
        let expectedString = "\tExpected Results:";
        let actualString = "\tQueried Results:";
        for(let j = 0; j < record.expected_value.length; j++) {
            expectedString += `\n\t> ${record.expected_value[j]}`
        }
        for(let k = 0; k < clean_response.length; k++) {
            actualString += `\n\t> ${clean_response[k]}`
        }
        if(record.expected_value.length > clean_response.length) {
            // DNS Record Missing Values
            return `${warning_level}\t${record.type}\t\t${record.host} is missing values!\n${expectedString}\n\n${actualString}\n`;
        } else if(record.expected_value.length < response.length) {
            // DNS Record Has Extra Values
            return `${warning_level}\t${record.type}\t\t${record.host} has extra values!\n${expectedString}\n\n${actualString}\n`;
        } else {
            // DNS Record Has Incorrect Values
            return `${warning_level}\t${record.type}\t\t${record.host} has incorrect values!\n${expectedString}\n\n${actualString}\n`;
        }
    }
}

function findDifferences(expected, found, caseSensitive = false) {
    let expectedNormalized = [];
    let foundNormalized = [];
    if(caseSensitive) {
        expectedNormalized = expected;
        foundNormalized = found;
    } else {
        for(let i = 0; i < expected.length; i++) {
            expectedNormalized.push(expected[i].toLowerCase());
        }
        for(let j = 0; j < found.length; j++) {
            foundNormalized.push(found[j].toLowerCase());
        }
    }

    let temp = [], output = [];

    for (let k = 0; k < expectedNormalized.length; k++) {
        temp[expectedNormalized[k]] = true;
    }
    for (let l = 0; l < foundNormalized.length; l++) {
        if (temp[foundNormalized[l]]) {
            delete temp[foundNormalized[l]];
        } else {
            temp[foundNormalized[l]] = true;
        }
    }
    for (let m in temp) {
        output.push(m);
    }
    return output;
}

exports.Resolver = function resolve(cases) {
    for(let i = 0; i < cases.length; i++) {
        const warning_level = (cases[i].hard_fail === true)? `${RED}FAILED${CLEAR}` : `${YELLOW}WARNING${CLEAR}`;
        switch(cases[i].type) {
            case "A":
                dns.resolve4(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            case "AAAA":
                dns.resolve6(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            case "CNAME":
                dns.resolveCname(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            case "CAA":
                dns.resolveCaa(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            case "MX":
                dns.resolveMx(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            case "NAPTR":
                dns.resolveNaptr(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            case "NS":
                dns.resolveNs(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            case "PTR":
                dns.resolvePtr(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            case "SOA":
                dns.resolveSoa(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            case "SVR":
                dns.resolveSvr(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            case "TXT":
                dns.resolveTxt(cases[i].host, (err, ret) => {
                    if(err) {
                        console.error(`${warning_level}\t${cases[i].type}\t\t${cases[i].host}\n>\tRecord Does Not Exist`);
                    } else {
                        console.log(matchOutput(cases[i].type, cases[i], ret))
                    }
                });
                break;
            default:
                console.error("Unknown Record type: ", cases[i].type, "\t", cases[i].host);

        }
    }
}