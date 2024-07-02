const axios = require('axios');
const cheerio = require('cheerio');
const fs = require ('fs');

const url = 'https://matokeo.necta.go.tz/results/2023/csee/CSEE2023/results/s4459.htm';

async function getResults() {
        //initialization
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const results = [];
        // console.log($)


//scrapping the required data
        $('table[width="70%"]').first().find('tbody>tr:nth-child(n+2)').each((index, output) => {
            //initialize for the subjects
            const Subjectoutput = $(output).find('td[width="58%"] p[align="LEFT"] font[face="Arial"]').text().trim()
            const subjectsArray = Subjectoutput.split(/\s{2,}/).map(subject => subject.trim())
            // console.log(subjectsArray)

            const subjects = subjectsArray.map(subject => {
                const [subjectName, grade] = subject.split(' - ');
                return {
                    subject: subjectName,
                    grade: grade
                };
            });

            // console.log(subjects)


            const item = {
                "ExamNumber": $(output).find('td[width="6%"] p[align="CENTER"] font[face="Arial"]').eq(0).text().trim(),
                "Points": $(output).find('td[width="6%"] p[align="CENTER"] font[face="Arial"]').eq(1).text().trim(),
                "Division": $(output).find('td[width="4%"] p[align="CENTER"] font[face="Arial"]').eq(1).text().trim(),
                "Subjects" : subjects
            };
            results.push(item);
    });
    console.log(JSON.stringify(results, null, 2))

        //console.log(JSON.stringify(results, null, 2));
       // Write results to a JSON file
       //  fs.writeFile('nationalResults.json', JSON.stringify(results, null, 2), (err) => {
       //      if (err) {
       //          console.error('Error writing to file', err);
       //      } else {
       //          console.log('Results successfully written to nationalResults.json');
       //      }
       //  });
        return results;




}

getResults()