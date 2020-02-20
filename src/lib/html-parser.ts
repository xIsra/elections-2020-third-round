import * as cheerio from "cheerio";

export async function getPartyList(){

    const response = await fetch("https://www.idi.org.il/policy/parties-and-elections/elections/2020-1/");

    const $ = cheerio.load(await response.text());
    const tableRows = $('.table-party table tbody tr');
    tableRows.each((index, element)=>{
        const td = $(element).find("td").first();
        console.log(td.text());
        
    })
    // window.alert(id);
}