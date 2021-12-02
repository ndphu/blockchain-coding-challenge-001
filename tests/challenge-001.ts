import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Challenge001 } from '../target/types/challenge_001';
const assert = require('assert');
import { logArticle } from './utils';

const simpleTitlePrefix = 'Test Article ';
const simpleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

describe('challenge-001', () => {
  const provider = anchor.Provider.env();
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const program = anchor.workspace.Challenge001 as Program<Challenge001>;
  const article = anchor.web3.Keypair.generate();
  const title = simpleTitlePrefix + Math.floor(Math.random() * 10000000);

  it('Create new article!', async () => {
    await program.rpc.createArticle(title, simpleText, {
      accounts: {
        article: article.publicKey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      },
      signers: [article]
    });
  });

  it('Fetch created article', async () => {
    let articleAccount = await program.account.article.fetch(article.publicKey);

    assert.ok(articleAccount.creator.equals(provider.wallet.publicKey));
    assert.ok(articleAccount.title === title);
    assert.ok(articleAccount.content === simpleText);

    logArticle(article.publicKey, articleAccount);
  });

  const updatedTitle = title + " >>> Updated";
  it('Update article!', async () => {
    await program.rpc.updateTitle(updatedTitle, {
      accounts: {
        article: article.publicKey,
        creator: provider.wallet.publicKey,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      },
    });
  });

  it('Fetch updated article', async () => {
    let articleAccount = await program.account.article.fetch(article.publicKey);

    assert.ok(articleAccount.creator.equals(provider.wallet.publicKey));
    assert.ok(articleAccount.title === updatedTitle);
    assert.ok(articleAccount.content === simpleText);

    logArticle(article.publicKey, articleAccount);
  });

});
