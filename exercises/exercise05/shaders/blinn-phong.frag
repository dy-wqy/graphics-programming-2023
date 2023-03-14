#version 330 core

in vec3 WorldPosition;
in vec3 WorldNormal;
in vec2 TexCoord;

out vec4 FragColor;

uniform vec4 Color;
uniform sampler2D ColorTexture;
uniform vec3 AmbientColor;
uniform vec3 LightColor;
uniform vec3 LightPosition;
uniform float LightIntensity;
uniform float AmbientReflection;
uniform float DiffuseReflection;
uniform float SpecularReflection;
uniform float SpecularExponent;
uniform vec3 CameraPosition;

vec3 GetAmbientReflection(vec4 color)
{
	return color.rgb * AmbientColor * AmbientReflection;
}

vec3 GetDiffuseReflection(vec4 color, vec3 lightColor, float lightIntensity, vec3 lightDir, vec3 norm)
{

	float cosine = max(dot(norm, lightDir), 0);
	return lightIntensity * lightColor * DiffuseReflection * color.rgb * cosine;
}

vec3 GetSpecularReflection(float lightIntensity, vec3 lightColor, float specularRefl, float specularExp, vec3 norm, vec3 lightDir, vec3 viewDir)
{
	vec3 halfVec = normalize(lightDir + viewDir);
	float cosine = max(dot(norm, halfVec), 0);
	return lightIntensity * lightColor * specularRefl * pow(cosine, specularExp);
}

vec3 GetBlinnPhongReflection(vec4 color, vec3 lightColor, float lightIntensity, vec3 lightDir, vec3 norm, float specularRefl, float specularExp, vec3 viewDir)
{
	vec3 ambient = GetAmbientReflection(color);
	vec3 diffuse = GetDiffuseReflection(color, lightColor, lightIntensity, lightDir, norm);
	vec3 specular = GetSpecularReflection(lightIntensity, lightColor, specularRefl, specularExp, norm, lightDir, viewDir);
	return ambient + diffuse + specular;
}



void main()
{
	vec4 color = texture(ColorTexture, TexCoord) * Color;

	vec3 norm = normalize(WorldNormal);
	vec3 lightDir = normalize(LightPosition - WorldPosition);
	vec3 viewDir = normalize(CameraPosition - WorldPosition);
	vec3 blinnPhong = GetBlinnPhongReflection(color, LightColor, LightIntensity, lightDir, norm, SpecularReflection, SpecularExponent, viewDir);

	FragColor = vec4(blinnPhong, 1.0);
}