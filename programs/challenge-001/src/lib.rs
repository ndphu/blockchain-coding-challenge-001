use anchor_lang::prelude::*;

declare_id!("3R5tn5uPJULaLmipfjJrzdaQVu9pgBWY3AAL2wXTYBoe");

#[program]
pub mod challenge_001 {
    use super::*;
    pub fn create_article(ctx: Context<CreateArticle>, title: String, content: String) -> ProgramResult {
        let article = &mut ctx.accounts.article;
        article.creator = ctx.accounts.creator.key();
        article.created_ts = ctx.accounts.clock.unix_timestamp;
        article.updated_ts = ctx.accounts.clock.unix_timestamp;
        article.title = title;
        article.content = content;
        Ok(())
    }

    pub fn update_title(ctx: Context<UpdateArticle>, title: String) ->  ProgramResult {
        let article = &mut ctx.accounts.article;
        if &article.creator != ctx.accounts.creator.key {
            return Err(ErrorCode::Unauthorized.into());
        }
        
        article.updated_ts = ctx.accounts.clock.unix_timestamp;
        article.title = title;
    
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateArticle<'info> {
    #[account(init, payer = creator, space = 32 + 8 + 8 + 128 + 1024)]
    pub article: Account<'info, Article>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct UpdateArticle<'info> {
    #[account(mut)]
    pub article: Account<'info, Article>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub clock: Sysvar<'info, Clock>,
}

#[account]
pub struct Article {
    pub creator: Pubkey,
    pub created_ts: i64,
    pub updated_ts: i64,
    pub title: String,
    pub content: String,
}


#[error]
pub enum ErrorCode {
    #[msg("You don't have permission to update this article.")]
    Unauthorized,
}
