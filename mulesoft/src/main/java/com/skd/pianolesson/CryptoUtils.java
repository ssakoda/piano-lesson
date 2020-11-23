package com.skd.pianolesson;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;
import java.util.Date;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

public class CryptoUtils {
	private static final String SECRET = "IloveSaki";
	private static final String ISSUER = "pianolesson";
	
	public static String generateJWT(String subject) {
		Algorithm algorithm = Algorithm.HMAC256(SECRET);
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.HOUR, 2);
		Date expiresAt = cal.getTime();
		String token = JWT.create()
	        .withIssuer(ISSUER)
	        .withSubject(subject)
	        .withExpiresAt(expiresAt)
	        .sign(algorithm);
	    return token;
	}
	
	public static String validateJWT(String token) {
	    Algorithm algorithm = Algorithm.HMAC256(SECRET);
	    JWTVerifier verifier = JWT.require(algorithm)
	        .withIssuer(ISSUER)
	        .build(); //Reusable verifier instance
	    DecodedJWT jwt = verifier.verify(token);	
	    return jwt.getSubject();
	}
	
	public static String sha256(String str) throws Exception {
		MessageDigest digest = MessageDigest.getInstance("SHA-256");
		digest.reset();
		digest.update((SECRET + str).getBytes("utf8"));
		String hashed = String.format("%064x", new BigInteger(1, digest.digest()));
		return hashed;
	}
}
