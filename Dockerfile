# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY WebApplication3/WebApplication3.csproj WebApplication3/
COPY clientapp/ clientapp/

RUN dotnet restore WebApplication3/WebApplication3.csproj

COPY WebApplication3/ WebApplication3/

WORKDIR /src/WebApplication3
RUN dotnet publish WebApplication3.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "WebApplication3.dll"]
