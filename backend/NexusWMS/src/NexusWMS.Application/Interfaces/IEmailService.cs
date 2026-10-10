namespace NexusWMS.Application.Interfaces;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string toEmail, string toName, string verificationLink);
}
