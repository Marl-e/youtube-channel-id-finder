document.getElementById('extractButton').addEventListener('click', async function () {
    const queries = document.getElementById('queries').value.split('\n');
    const apiKey = document.getElementById('api_key').value;
    const resultsTable = document.getElementById('resultsTable');
    resultsTable.innerHTML = '<tr><th>Input URL</th><th>Channel ID</th></tr>';

    for (const query of queries) {
        const resultRow = await extractChannelId(query.trim(), apiKey);
        resultsTable.appendChild(resultRow);
    }

    console.log('All queries processed.');
});

async function extractChannelId(query, apiKey) {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=id&type=channel&maxResults=10&q=${query}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        let channelId = '';
        if (data.items && data.items.length > 0) {
            channelId = data.items[0].id.channelId;
        } else {
            console.log(`No results found for query: ${query}`);
            channelId = 'Not found';
        }

        return createResultRow(query, channelId);
    } catch (error) {
        console.error(`Error for query ${query}:`, error);
        return createResultRow(query, 'Error');
    }
}

function createResultRow(input, channelId) {
    const row = document.createElement('tr');
    const inputCell = document.createElement('td');
    const channelIdCell = document.createElement('td');

    inputCell.textContent = input;
    channelIdCell.textContent = channelId;

    row.appendChild(inputCell);
    row.appendChild(channelIdCell);

    return row;
}
