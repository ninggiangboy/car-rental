package com.fsa.car_rental.util;


import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Random;

@NoArgsConstructor(access = AccessLevel.NONE)
public class StringUtil {

    private static final Random RANDOM = new Random();

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) return "";
        return input.toLowerCase()
                .replaceAll("[áàảạãăắằẳẵặâấầẩẫậäåæą]", "a")
                .replaceAll("[óòỏõọôốồổỗộơớờởỡợöœø]", "o")
                .replaceAll("[éèẻẽẹêếềểễệěėëę]", "e")
                .replaceAll("[úùủũụưứừửữự]", "u")
                .replaceAll("[iíìỉĩịïîį]", "i")
                .replaceAll("[ùúüûǘůűūų]", "u")
                .replaceAll("[ßşśšș]", "s")
                .replaceAll("[źžż]", "z")
                .replaceAll("[ýỳỷỹỵÿ]", "y")
                .replaceAll("[ǹńňñ]", "n")
                .replaceAll("[çćč]", "c")
                .replaceAll("[ğǵ]", "g")
                .replaceAll("[ŕř]", "r")
                .replaceAll("[·/_,:;]", "-")
                .replaceAll("[ťț]", "t")
                // "String#replace" should be preferred to "String#replaceAll" (java:S5361)
                .replace("ḧ", "h")
                .replace("ẍ", "x")
                .replace("ẃ", "w")
                .replace("ḿ", "m")
                .replace("ṕ", "p")
                .replace("ł", "l")
                .replace("đ", "d")
                .replace("\\s+", "-")
                .replace("&", "-and-")
                .replaceAll("[^\\w\\-]+", "")
                .replaceAll("--+", "-")
                .replaceAll("^-+", "")
                .replaceAll("-+$", "");
    }

    public static String toSlugWithRandom(String name) {
        return toSlug(name) + "-" + RANDOM.nextInt(1000);
    }
}
