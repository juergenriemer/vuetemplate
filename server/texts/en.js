const text = (key, lang, tokens) => {
  let template = texts[key][lang].replace(/{nl}/g, "\n");
  for (var token in tokens) {
    const pattern = new RegExp(`{${token}}`, "g");
    template = template.replace(pattern, tokens[token]);
  }
  return template;
};

const texts = {
  mail_subject_share: {
    en: `{invitingUser} wants to share his listle "{listTitle}" with you!`,
  },
  mail_body_share_begin: {
    en: `Dear {email},\n
{invitingUser} has invited you to collaborate on this listle list "{listTitle}"!`,
  },
  mail_body_share_verified_user: {
    en: `Please visit{nl}{nl}
  {baseUrl}/user/approve-invites{nl}{nl}
to approve.`,
  },
  mail_body_share_unverified_user: {
    en: `It seems you already tried to register with listle.{nl}{nl}
In case you did not receive the confirmation e-mail please visit {nl}{nl}
  {baseUrl}/user/resend-verification{nl}{nl}
to request another e-mail.{nl}{nl}`,
  },
  mail_body_share_unregistered_user: {
    en: `It seems you did not yet register with listle.{nl}{nl}
Please visit {nl}{nl}
  {baseUrl}/user/register{nl}{nl}
to create an account, the lists will be shared with you automatically.{nl}{nl}`,
  },
};

text("mail_body_share_unregistered_user", "en", {
  baseUrl: "xxxx",
  listTitle: "uuuuuu",
});
module.exports.xt = text;
