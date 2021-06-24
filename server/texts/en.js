const text = (key, lang, tokens) => {
  let template = texts[key][lang].replace(/{nl}/g, "\n");
  template = template.replace(/{2nl}/g, "\n\n");
  template = template.replace(/{2br}/g, "<br><br>");
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
    en: `Please visit{2nl}
  {baseUrl}/user/approve-invites{2nl}
to approve.`,
  },
  mail_body_share_unverified_user: {
    en: `It seems you already tried to register with listle.{2nl}
In case you did not receive the confirmation e-mail please visit {2nl}
  {baseUrl}/user/resend-verification{2nl}
to request another e-mail.{2nl}`,
  },
  mail_body_share_unregistered_user: {
    en: `It seems you did not yet register with listle.{2nl}
Please visit {2nl}
  {baseUrl}/user/register{2nl}
to create an account, the lists will be shared with you automatically.{2nl}`,
  },
  info_invite: {
    en: `You have been invited by {userName} to join his list "{listName}".{2br}
Click on the button below to view your invitations.`,
  },
  info_unshare: {
    en: `You have been removed from list "{listName}" by {userName}.{2br}
It will no longer show up in your lists.</a>`,
  },
  info_approve_inivitation: {
    en: `{userName} has accepted your invitation to join the list "{listName}".{2br}
Click on the button below to manage memberships of this list.`,
  },
  info_decline_inivitation: {
    en: `{userName} has declined your invitation to join the list "{listName}".{2br}
Click on the button below to manage memberships of this list.`,
  },
  info_leave_list: {
    en: `{userName} has left the list "{listName}".{2br}
Click on the button below to manage memberships of this list.`,
  },
};

text("mail_body_share_unregistered_user", "en", {
  baseUrl: "xxxx",
  listTitle: "uuuuuu",
});
module.exports.xt = text;
