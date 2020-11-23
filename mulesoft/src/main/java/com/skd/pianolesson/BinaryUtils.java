package com.skd.pianolesson;

import java.io.ByteArrayOutputStream;

public class BinaryUtils {
	public static byte[] append(byte[] a, byte[] b) throws Exception{
		ByteArrayOutputStream baos = new ByteArrayOutputStream(a.length + b.length);
		baos.write(a);
		baos.write(b);
		return baos.toByteArray();
	}
}
