FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY NexusWMS/NexusWMS.sln ./
COPY NexusWMS/src/ ./src/
# Chỉ restore project API để image không phụ thuộc project test (NexusWMS.UnitTests).
RUN dotnet restore src/NexusWMS.API/NexusWMS.API.csproj
RUN dotnet publish src/NexusWMS.API/NexusWMS.API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "NexusWMS.API.dll"]
