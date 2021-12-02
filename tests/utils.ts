export const logArticle = (pubkey, data) => {
    console.log(` - Article Address: ${pubkey.toBase58()}\n` + 
    `  - Title: ${data.title}\n` + 
    `  - Content: ${data.content}\n` +
    `  - Creator: ${data.creator.toBase58()}\n` +
    `  - Created at: ${new Date(data.createdTs*1000).toISOString()}\n` +
    `  - Updated at: ${new Date(data.updatedTs*1000).toISOString()}\n`
    );
}